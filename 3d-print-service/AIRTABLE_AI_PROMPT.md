# Airtable AI Prompt für 3D-Druck-Service Integration

## 🎯 Ziel
Erstelle einen intelligenten 3D-Druck-Service, der automatisch Bestellungen aus einer Webanwendung empfängt und verarbeitet.

## 📋 Anforderungen an die KI

### **1. Automatische Tabellenerstellung**
Erstelle eine Tabelle "Bestellungen" mit diesen exakten Feldern:
- **Customer Email** (Email) - Single Line Text
- **First Name** (Text) - Single Line Text  
- **Last Name** (Text) - Single Line Text
- **Phone** (Phone) - Single Line Text
- **Address** (Single Line Text) - Single Line Text
- **Postal Code** (Single Line Text) - Single Line Text
- **City** (Single Line Text) - Single Line Text
- **Country** (Single Line Text) - Single Line Text
- **Material** (Single Select) - Optionen: PLA, PETG, TPU
- **Quality** (Single Select) - Optionen: standard, high, draft
- **Infill** (Single Select) - Optionen: standard, massive
- **Total Price** (Currency) - € Format
- **Print Time** (Number) - Minuten
- **Status** (Single Select) - Optionen: 🆕 Eingegangen, 🖨️ In Bearbeitung, ✅ Abgeschlossen, ❌ Storniert, ⚠️ Fehler
- **Created At** (DateTime) - Automatisch
- **Order ID** (Formula) - Automatisch generiert
- **STL File** (Attachment) - Für 3D-Dateien

### **2. Automatische Webhook-Integration**
Erstelle einen Webhook-Endpunkt, der:
- **POST** von der Webanwendung empfängt
- **JSON-Daten parst** und validiert
- **Automatisch in die Tabelle einfügt**
- **Bestell-ID generiert** und zurückgibt
- **Status-Updates sendet** an die Webanwendung

### **3. Automatische Automatisierung**
Erstelle diese Automatisierungen:
- **Status-Updates**: Bei Status-Änderungen automatisch E-Mails senden
- **Druck-Planung**: Basierend auf Druckzeit und Material automatisch planen
- **Benachrichtigungen**: Bei neuen Bestellungen automatisch benachrichtigen
- **Datenvalidierung**: Alle eingehenden Daten automatisch validieren

### **4. Intelligente Preisberechnung**
Erstelle eine Formel für die Preisberechnung:
- **Materialkosten**: 20 €/kg × Gewicht
- **Druckzeit**: 1.75 Min/g + 10 Min. Warm-up
- **Komplexitätsfaktor**: Basierend auf Dreiecksdichte
- **Servicegebühr**: 5 € fest
- **Marge**: 25% auf Zwischensumme
- **MwSt**: 19% auf Nettobetrag

### **5. API-Endpunkt**
Erstelle eine REST API mit:
- **POST /orders** - Neue Bestellungen erstellen
- **GET /orders/{id}** - Bestellstatus abfragen
- **PATCH /orders/{id}** - Status aktualisieren
- **GET /orders** - Alle Bestellungen auflisten
- **Authentifizierung** mit API-Key
- **Fehlerbehandlung** und detaillierte Responses

## 🔧 Technische Anforderungen

### **Datenbank-Struktur**
```sql
CREATE TABLE Bestellungen (
  id INTEGER PRIMARY KEY,
  customer_email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  country TEXT DEFAULT 'Deutschland',
  material TEXT CHECK(material IN ('PLA', 'PETG', 'TPU')),
  quality TEXT CHECK(quality IN ('standard', 'high', 'draft')),
  infill TEXT CHECK(infill IN ('standard', 'massive')),
  total_price DECIMAL(10,2),
  print_time INTEGER,
  status TEXT DEFAULT '🆕 Eingegangen',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  order_id TEXT UNIQUE,
  stl_file BLOB
);
```

### **API-Response-Format**
```json
{
  "success": true,
  "order": {
    "id": "ORDER-1234567890-ABCDEF",
    "customer_email": "kunde@example.com",
    "status": "🆕 Eingegangen",
    "total_price": 25.50,
    "estimated_print_time": 120,
    "created_at": "2024-03-17T17:39:00Z"
  },
  "message": "Bestellung erfolgreich erstellt"
}
```

### **Webhook-Format**
```json
{
  "event": "order.created",
  "data": {
    "order_id": "ORDER-1234567890-ABCDEF",
    "customer_email": "kunde@example.com",
    "total_price": 25.50,
    "material": "PLA",
    "quality": "standard",
    "infill": "massive"
  }
}
```

## 🚀 Implementierungs-Schritte

### **Schritt 1: Tabellenerstellung**
1. Erstelle die "Bestellungen" Tabelle mit allen Feldern
2. Konfiguriere Feldtypen und Validierungen
3. Erstelle Formeln für automatische Berechnungen
4. Setze Standardwerte und Optionen

### **Schritt 2: API-Entwicklung**
1. Erstelle REST API mit allen Endpunkten
2. Implementiere Authentifizierung
3. Füge Fehlerbehandlung hinzu
4. Erstelle API-Dokumentation

### **Schritt 3: Webhook-Integration**
1. Erstelle Webhook-Endpunkt
2. Implementiere Datenvalidierung
3. Füge automatische Antworten hinzu
4. Teste die Integration

### **Schritt 4: Automatisierung**
1. Erstelle E-Mail-Vorlagen
2. Konfiguriere Benachrichtigungen
3. Implementiere Status-Tracking
4. Erstelle Druck-Planung

## 📊 Erfolgsmetriken

### **KPIs zur Überwachung**
- **Bestellungen pro Tag**
- **Durchschnittliche Bestellwert**
- **Materialverteilung**
- **Qualitätsverteilung**
- **Durchschnittliche Druckzeit**
- **Fehlerquote**
- **Kundenzufriedenheit**

### **Dashboard-Einblicke**
- **Live-Bestellungsübersicht**
- **Umsatzstatistiken**
- **Druckkapazitätsplanung**
- **Materialverbrauchsanalyse**
- **Kundenstatistiken**

## 🎯 Zielsetzung

Mit diesem Prompt soll die Airtable KI in der Lage sein:
1. **Vollständig automatisiert** einen 3D-Druck-Service aufzusetzen
2. **Intelligent** Bestellungen zu verarbeiten und zu planen
3. **Skalierbar** für wachsendes Auftragsvolumen
4. **Benutzerfreundlich** mit automatischen Benachrichtigungen
5. **Effizient** durch optimierte Prozesse

---

**Bitte implementiere diesen vollständigen 3D-Druck-Service mit allen oben genannten Funktionen und Automatisierungen.**
