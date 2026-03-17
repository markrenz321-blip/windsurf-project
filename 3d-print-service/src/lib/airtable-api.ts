// Airtable API Integration für 3D-Druck-Service

interface AirtableConfig {
  baseId: string;
  tableId: string;
  apiKey: string;
}

interface OrderData {
  id: string;
  status: string;
  customerEmail?: string;
  material?: string;
  quality?: string;
  infill?: string;
  totalPrice?: number;
  estimatedPrintTime?: number;
  createdAt: string;
}

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
}

interface AirtableResponse {
  records: AirtableRecord[];
}

class AirtableAPI {
  private config: AirtableConfig;
  private baseUrl: string = 'https://api.airtable.com/v0';

  constructor(config: AirtableConfig) {
    this.config = config;
  }

  public getConfig(): AirtableConfig {
    return this.config;
  }

  async createOrder(orderData: Partial<OrderData>): Promise<OrderData> {
    const orderId = this.generateOrderId();
    
    const newOrder: OrderData = {
      id: orderId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...orderData
    };

    try {
      const response: Response = await fetch(`${this.baseUrl}/${this.config.baseId}/${this.config.tableId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [{
            fields: {
              'Bestell-ID': orderId,
              'Status': 'pending',
              'Kunden-E-Mail': newOrder.customerEmail || '',
              'Material': newOrder.material || '',
              'Qualität': newOrder.quality || '',
              'Füllung': newOrder.infill || '',
              'Gesamtpreis': newOrder.totalPrice || 0,
              'Druckzeit': newOrder.estimatedPrintTime || 0,
              'Erstellt am': newOrder.createdAt
            }
          }]
        }),
      });

      if (!response.ok) {
        throw new Error(`Airtable API Error: ${response.status}`);
      }

      const data: AirtableResponse = await response.json();
      return newOrder;
    } catch (error: any) {
      console.error('Fehler beim Erstellen der Bestellung:', error);
      throw error;
    }
  }

  async getOrderStatus(orderId: string): Promise<string> {
    try {
      const response: Response = await fetch(
        `${this.baseUrl}/${this.config.baseId}/${this.config.tableId}?filterByFormula=${encodeURIComponent(`{Bestell-ID}='${orderId}'`)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Airtable API Error: ${response.status}`);
      }

      const data: AirtableResponse = await response.json();
      
      if (data.records && data.records.length > 0) {
        return data.records[0].fields.Status || 'unknown';
      }
      
      return 'not_found';
    } catch (error: any) {
      console.error('Fehler beim Abrufen des Status:', error);
      return 'error';
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      const response: Response = await fetch(
        `${this.baseUrl}/${this.config.baseId}/${this.config.tableId}?filterByFormula=${encodeURIComponent(`{Bestell-ID}='${orderId}'`)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Airtable API Error: ${response.status}`);
      }

      const data: AirtableResponse = await response.json();
      
      if (data.records && data.records.length > 0) {
        const recordId = data.records[0].id;
        
        const updateResponse: Response = await fetch(`${this.baseUrl}/${this.config.baseId}/${this.config.tableId}/${recordId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: {
              'Status': status
            }
          }),
        });

        return updateResponse.ok;
      }
      
      return false;
    } catch (error: any) {
      console.error('Fehler beim Aktualisieren des Status:', error);
      return false;
    }
  }

  private generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `ORDER-${timestamp}-${random}`;
  }
}

class OrderStatusTracker {
  private airtableAPI: AirtableAPI;
  private checkInterval: NodeJS.Timeout | null = null;
  private onUpdateCallback?: (status: string) => void;

  constructor(config: AirtableConfig) {
    this.airtableAPI = new AirtableAPI(config);
  }

  async startTracking(orderId: string, onUpdate?: (status: string) => void): Promise<void> {
    console.log(`Starte Status-Tracking für Bestellung: ${orderId}`);
    
    if (onUpdate) {
      this.onUpdateCallback = onUpdate;
    }

    await this.checkStatus(orderId);

    this.checkInterval = setInterval(async () => {
      await this.checkStatus(orderId);
    }, 30000);
  }

  stopTracking(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('Status-Tracking gestoppt');
    }
  }

  private async checkStatus(orderId: string): Promise<void> {
    try {
      this.showLoadingAnimation();

      const status = await this.airtableAPI.getOrderStatus(orderId);
      
      if (this.onUpdateCallback) {
        this.onUpdateCallback(status);
      }

      this.hideLoadingAnimation();

      console.log(`Bestell-Status: ${orderId} -> ${status}`);

      if (status === 'completed' || status === 'cancelled' || status === 'error') {
        this.stopTracking();
      }
    } catch (error: any) {
      console.error('Fehler bei Status-Abfrage:', error);
      this.hideLoadingAnimation();
    }
  }

  private showLoadingAnimation(): void {
    const loadingElement = document.getElementById('order-status-loading');
    if (loadingElement) {
      loadingElement.style.display = 'block';
    }

    const statusText = document.getElementById('order-status-text');
    if (statusText) {
      statusText.textContent = 'Status wird abgefragt...';
    }
  }

  private hideLoadingAnimation(): void {
    const loadingElement = document.getElementById('order-status-loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }

  async createAndTrackOrder(orderData: Partial<OrderData>): Promise<{ orderId: string; tracker: OrderStatusTracker }> {
    const order = await this.airtableAPI.createOrder(orderData);
    const tracker = new OrderStatusTracker(this.airtableAPI.getConfig());
    
    await tracker.startTracking(order.id);
    
    return {
      orderId: order.id,
      tracker
    };
  }
}

export { AirtableAPI, OrderStatusTracker };

export const airtableConfig: AirtableConfig = {
  baseId: process.env.AIRTABLE_BASE_ID || '',
  tableId: process.env.AIRTABLE_TABLE_ID || '',
  apiKey: process.env.AIRTABLE_API_KEY || ''
};
