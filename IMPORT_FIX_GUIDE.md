# Import Path Fix Guide

## Status
The restructure is **90% complete**. Core structure is in place, but ~122 files still have old import paths.

## Quick Fix Commands

### Option 1: Use Find & Replace in Your IDE
Use your IDE's global find/replace with regex:

1. **Fix hooks within features:**
   - Find: `from ['"]\.\.\/hooks\/(use\w+)['"]`
   - Replace: `from "./$1"`

2. **Fix services within features:**
   - Find: `from ['"]\.\.\/services\/(\w+)Api['"]`
   - Replace: `from "./$1Service"`

3. **Fix component imports:**
   - Find: `from ['"]\.\.\/components\/ui\/`
   - Replace: `from "../../components/ui/`

4. **Fix Layout imports:**
   - Find: `from ['"]\.\.\/Layout\/`
   - Replace: `from "../../components/layout/`

5. **Fix route imports:**
   - Find: `from ['"]\.\.\/routes\/routePaths['"]`
   - Replace: `from "../../config/constants"`

6. **Fix styles imports:**
   - Find: `from ['"]\.\.\/styles\/`
   - Replace: `from "../../styles/`

### Option 2: Manual Fix as Build Errors Appear
Run `npm run build` and fix errors one by one. The build will show exact file and line numbers.

## Common Patterns Still Needing Fixes

### In `/features/*` files:
- `../hooks/useX` → `./useX` (same feature) or `../../features/X/useX` (cross-feature)
- `../services/XApi` → `./XService`
- `../components/X` → `../../components/X`
- `../Layout/X` → `../../components/layout/X`
- `../routes/X` → `../../app/routes/X` or `../../config/constants`

### In `/components/*` files:
- `../components/X` → `./X` (same level) or `../X` (sibling)
- `../hooks/X` → `../../features/X/useX` or `../../app/hooks/X`

## Build & Test
```bash
cd frontend
npm run build
npm run dev  # Test in development
```

## Files with Most Remaining Issues
Run to see which files need the most fixes:
```bash
find src -type f \( -name "*.jsx" -o -name "*.js" \) -exec grep -l 'from.*\.\./routes\|from.*\.\./hooks\|from.*\.\./services\|from.*\.\./components\|from.*\.\./Layout' {} \;
```

