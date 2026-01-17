
# Diagram Sistem

## 1. Siklus Hidup Aset (State Diagram)
*(Sama seperti sebelumnya)*

## 2. Alur Peminjaman Aset
*(Sama seperti sebelumnya)*

## 3. Alur Handover dengan Logika "Measurement Split"

Diagram ini menjelaskan apa yang terjadi saat Gudang menyerahkan sebagian stok kabel (misal: 100m dari Drum 1000m) ke Teknisi.

```mermaid
sequenceDiagram
    participant Admin as Admin Logistik
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    Admin->>FE: Input Handover (Item: Kabel FO, Qty: 100m)
    FE->>FE: Deteksi Tipe = Measurement
    
    FE->>BE: POST /api/handovers
    Note right of FE: Payload: { items: [{ assetId: 'DRUM-01', quantity: 100, unit: 'Meter' }] }
    
    activate BE
    BE->>DB: Get Asset 'DRUM-01'
    DB-->>BE: Asset Data (Balance: 1000m)
    
    BE->>BE: Calc New Balance (1000 - 100 = 900)
    
    BE->>DB: BEGIN TRANSACTION
    
    Note right of BE: 1. Update Induk
    BE->>DB: Update Asset 'DRUM-01' (Balance=900)
    
    Note right of BE: 2. Create Pecahan (Child Asset)
    BE->>DB: Create Asset 'DRUM-01-PART-TIMESTAMP'
            (Name: Kabel FO (Potongan), 
             Balance: 100, 
             Owner: Teknisi)
    
    Note right of BE: 3. Create Handover Doc
    BE->>DB: Create Handover Record
    
    BE->>DB: COMMIT
    
    BE-->>FE: 201 Created
    deactivate BE
    
    FE->>Admin: Tampilkan Sukses & Stok Terupdate
```
