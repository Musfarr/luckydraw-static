# Performance Optimization Guide for Lucky Draw (47k+ Records)

## Current Implementation ✅

### 1. **React Query Shared Cache**
- Using shared query key `'allCustomersData'` between Home and LuckyDraw pages
- **Benefit**: Data fetched once, reused across pages
- **Cache Settings**: 30min staleTime, 1hr cacheTime

### 2. **useMemo Optimization** 
- Memoized expensive calculations:
  - `uniqueZones` - Only recalculates when data/filters change
  - `uniqueRegions` - Depends on zone selection
  - `uniqueAreas` - Depends on zone/region selection
  - `eligibleParticipantsList` - Recalculates only when filters change
- **Benefit**: Prevents 47k array operations on every render

## Additional Optimizations to Consider

### 3. **Virtual Scrolling for Participant List** (Recommended)
Install `react-window` or `react-virtualized`:

```bash
npm install react-window
```

Update participant list to only render visible items:

```javascript
import { FixedSizeList } from 'react-window';

// In participants section:
<FixedSizeList
  height={400}
  itemCount={filterParticipants().length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => {
    const participant = filterParticipants()[index];
    return (
      <div key={participant.cust_cd} style={style} className="participant-item">
        {/* Participant content */}
      </div>
    );
  }}
</FixedSizeList>
```

**Impact**: Renders only ~20-30 items instead of 47,000+

---

### 4. **Backend Optimization** (Most Effective) 🔥

#### Option A: Add Lucky Draw Specific Endpoint
```javascript
// Backend: GET /api/lucky-draw-data
// Returns ONLY customers with entries > 0
{
  data: [...], // Pre-filtered customers
  counts: {
    platinum: 150,
    gold: 450, 
    silver: 2000
  }
}
```

**Frontend Change:**
```javascript
const { data: luckyDrawData } = useQuery({
  queryKey: ['luckyDrawData'],
  queryFn: () => apiGetasync('/api/lucky-draw-data')
});
```

**Benefit**: Reduces 47k to ~2-3k eligible customers only

---

#### Option B: Backend Aggregation for Zones/Regions
```javascript
// GET /api/lucky-draw-filters
{
  zones: ['North', 'South', 'East', 'West'],
  regions: { 'North': ['Lahore', 'Islamabad'], ... },
  areas: { 'Lahore': ['Area1', 'Area2'], ... }
}
```

**Benefit**: No client-side filtering of 47k records for dropdowns

---

#### Option C: Lazy Load by Geographic Filter
```javascript
// GET /api/lucky-draw-participants?zone=North&region=Lahore&tier=Platinum
```

Fetch participants only when user selects filters.

**Benefit**: Never loads full 47k dataset

---

### 5. **IndexedDB Caching** (Advanced)

For offline capability and faster subsequent loads:

```javascript
import { openDB } from 'idb';

const db = await openDB('LuckyDrawDB', 1, {
  upgrade(db) {
    db.createObjectStore('customers');
  }
});

// Store data
await db.put('customers', data, 'all');

// Retrieve data
const cachedData = await db.get('customers', 'all');
```

---

### 6. **Web Worker for Heavy Calculations** (Advanced)

Move filtering logic to Web Worker:

```javascript
// luckyDrawWorker.js
self.addEventListener('message', (e) => {
  const { customers, filters } = e.data;
  const filtered = customers.filter(/* filtering logic */);
  self.postMessage(filtered);
});

// In component:
const worker = new Worker('luckyDrawWorker.js');
worker.postMessage({ customers: data, filters });
worker.onmessage = (e) => setFilteredParticipants(e.data);
```

---

## Recommended Implementation Order

### Phase 1: Frontend Only (Current + Next Step)
1. ✅ React Query shared cache
2. ✅ useMemo optimization
3. **🔥 Virtual scrolling for participant list** (biggest UI impact)

**Expected Result**: Smooth UI even with 47k records

---

### Phase 2: Backend Optimization (Best Long-term)
1. **Create `/api/lucky-draw-data` endpoint**
   - Filter backend-side: `entry_count.platinum > 0 OR entry_count.gold > 0 OR entry_count.silver > 0`
   - Reduce payload from ~47k to ~3k
   
2. **Add backend aggregation for filters**
   - Distinct zones/regions/areas endpoint
   - No client-side filtering needed

**Expected Result**: 10x faster page load, minimal network transfer

---

### Phase 3: Advanced (If Needed)
1. IndexedDB for offline caching
2. Web Workers for complex calculations
3. Server-side pagination for participant list

---

## Performance Metrics Target

| Metric | Before | After Phase 1 | After Phase 2 |
|--------|--------|---------------|---------------|
| Initial Load | ~5-8s | ~2-3s | <1s |
| Filter Change | ~1-2s | <100ms | <50ms |
| Participant Render | Laggy | Smooth | Smooth |
| Memory Usage | ~200MB | ~150MB | ~50MB |

---

## Quick Wins (Do Now) 🚀

1. ✅ Already implemented shared cache
2. ✅ Already implemented useMemo
3. **Install react-window and virtualize participant list**
4. **Ask backend team to create `/api/lucky-draw-data` endpoint**

---

## Global Store (Context/Redux) - Do You Need It?

**Answer: NO for this use case**

- React Query already provides global cache
- useMemo handles expensive recalculations
- Context/Redux won't solve the 47k record performance issue
- Would add complexity without performance benefit

**When to use global store:**
- Sharing data between deeply nested components
- Complex state management logic
- Not for performance optimization

---

## Conclusion

**Best Solution**: Backend optimization (#4) + Virtual scrolling (#3)

**Quick Win**: Implement virtual scrolling now while waiting for backend changes.

React Query cache + useMemo already provides excellent optimization. The main bottleneck is:
1. Network transfer of 47k records
2. Rendering large lists in DOM

Virtual scrolling fixes #2 immediately. Backend filtering fixes #1 permanently.
