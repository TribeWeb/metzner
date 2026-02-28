# Google Sheets Import Module

Schema-driven Google Sheets import for Nuxt + Nuxt Content.

This module provides:
- Server routes to fetch sheet metadata, fetch values, validate/transform rows, and write Markdown frontmatter files
- Composables (`useGoogleSheetsImport`, `useGoogleSheetsImportWorkflow`) for API access + workflow state
- Drop-in UI components with clear responsibilities (`GoogleSheetsImportSource`, `GoogleSheetsImportExecute`)
- Shared Google Sheets API types

## Feature Highlights

- Schema-driven row transformation + Zod validation before writing files
- Output formats: Markdown frontmatter (`.md`), JSON (`.json`), YAML (`.yml`)
- Overwrite policies:
  - `overwrite` (replace existing files)
  - `skip` (leave existing files untouched)
  - `overwrite-frontmatter` (for existing `.md`: replace frontmatter, retain markdown body)
- Collection-type aware destination routing:
  - `page` schemas -> `content/{folder}`
  - `data` schemas -> `content/data/{folder}`
  - Resolution uses server logic (config mapping + `content.config.ts` parsing fallback)
- Write summary returned by API/UI: `written`, `overwritten`, `skipped`
- Live destination preview in UI showing resolved collection type and target path before write

## Install (local module)

The module is already added in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['./modules/google-sheets-import'],
  googleSheetsImport: {
    apiBase: '/api/google-sheets-import',
    googleApiKeyRuntimeKey: 'googleApiKey',
    defaultContentDir: 'content/data',
    collectionTypeBySchema: {
      about: 'page',
      machines: 'page',
      peripherals: 'page',
      materials: 'data'
    }
  }
})
```

Set your API key in runtime config/env:

```env
NUXT_GOOGLE_API_KEY=your_google_api_key
```

## Google setup (permissions + API key)

This module currently reads Google Sheets using an API key, so the sheet must be publicly readable.

> Security note:
> API-key access is best suited to non-sensitive sheets that are intentionally shared as `Anyone with the link`.
> For private or sensitive spreadsheets, prefer OAuth 2.0 or a service account flow instead of API-key access.

### 1) Set sheet permissions (Google Sheets)

1. Open your sheet in Google Sheets.
2. Click `Share`.
3. Under `General access`, set to `Anyone with the link`.
4. Set role to `Viewer`.
5. Copy the spreadsheet ID from the URL:
  - `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`

If your Google Workspace policy blocks public link sharing, API key access will fail. In that case you need OAuth/service-account based auth (not part of this module yet).

### 2) Create API key (Google Cloud Console)

1. Open Google Cloud Console: https://console.cloud.google.com/
2. Create/select a project.
3. Enable Google Sheets API:
  - https://console.cloud.google.com/apis/library/sheets.googleapis.com
4. Create credentials (API key):
  - https://console.cloud.google.com/apis/credentials
  - Click `Create credentials` → `API key`
5. Restrict the key (recommended):
  - **API restrictions**: `Restrict key` → select `Google Sheets API`
  - **Application restrictions**:
    - Server usage: `IP addresses` (recommended for backend)
    - Browser-only usage: `HTTP referrers` (if applicable)
6. Put the key into `NUXT_GOOGLE_API_KEY`.

### 3) Quick verification

Call your module endpoint with a known sheet ID and confirm it returns tab metadata:

`GET /api/google-sheets-import/sheets?spreadsheetId=<SPREADSHEET_ID>`

### 4) Troubleshooting (common errors)

- `403 PERMISSION_DENIED` / `The caller does not have permission`
  - The sheet is not publicly readable with link.
  - Fix: set `Share` → `General access` → `Anyone with the link` + `Viewer`.

- `403 API key not valid` or `API has not been used in project`
  - The key is wrong, restricted to the wrong API, or Sheets API is not enabled.
  - Fix: enable `Google Sheets API` and ensure key restriction includes it.

- `403 Requests from this referrer/IP are blocked`
  - Your key application restrictions do not match where requests come from.
  - Fix: update key restrictions (`IP addresses` for server use is preferred).

- `404 Requested entity was not found`
  - Spreadsheet ID is incorrect or malformed.
  - Fix: copy ID from `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`.

- `400 Unable to parse range`
  - Invalid A1 range (for example typo in sheet tab or columns).
  - Fix: verify tab name and use ranges like `A:Z`.

## Module Options

```ts
interface ModuleOptions {
  apiBase: string
  googleApiKeyRuntimeKey: string
  defaultContentDir: string
  collectionTypeBySchema: Record<string, 'page' | 'data'>
}
```

- `apiBase`: Base route for module APIs
- `googleApiKeyRuntimeKey`: Dot path in `runtimeConfig` where API key is read
- `defaultContentDir`: Base directory for output files (relative to project root)
- `collectionTypeBySchema`: maps schema key to Nuxt Content collection type (`page` or `data`)

## Components

### `GoogleSheetsImportSource` (recommended)

Source-selection step (spreadsheet/tab/range/schema) that renders the execute step once valid.

```vue
<GoogleSheetsImportSource :google-sheets="[{ id: 'spreadsheet-id', label: 'Machines' }]" />
```

Props:
- `googleSheets: { id: string; label: string }[]`

### `GoogleSheetsImportExecute` (recommended)

Validation + write step for a known query.

```vue
<GoogleSheetsImportExecute
  :query="{
    spreadsheetId: '...',
    sheetTitle: 'machines',
    range: 'A:Z',
    schema: 'machines'
  }"
/>
```

Props:
- `query.spreadsheetId`
- `query.sheetTitle`
- `query.range`
- `query.schema`

### `GoogleSheetsImportSchemaGuide`

Schema picker that displays the expected Google Sheet column headers for the selected collection schema.

```vue
<GoogleSheetsImportSchemaGuide />
```

Benefits:

- Reduces import failures by giving editors exact header names before filling a sheet
- Supports nested/array header patterns used by schema mapping (for example `items[0].name`)
- For `page` collections, shows Nuxt Content built-in page override fields and allows copying them separately
- Supports two copy modes:
  - line-by-line copy
  - CSV-row copy (pastes horizontally into Google Sheets)

Optional prop:

- `initialSchema?: string`

### When to use each component

- Use `GoogleSheetsImportSource` when editors should choose spreadsheet + tab interactively.
- Use `GoogleSheetsImportExecute` when source details are already known and should be prefilled/locked.

## `GoogleSheetsImportExecute` standalone use case

Useful for dedicated admin pages where the dataset is fixed and the user should only run validation + write.

```vue
<script setup lang="ts">
const fixedQuery = {
  spreadsheetId: '1abcDEFghiJKLmnopQRstuVWxyz1234567890abcd',
  sheetTitle: 'machines',
  range: 'A:AZ',
  schema: 'machines'
}
</script>

<template>
  <GoogleSheetsImportExecute :query="fixedQuery" />
</template>
```

This keeps the UI smaller for repeat imports and prevents accidental source changes.

## Composable

```ts
const { getSheets, getValues, writeFiles } = useGoogleSheetsImport()

const sheets = await getSheets(spreadsheetId)

const { records, errors } = await getValues({
  spreadsheetId,
  sheetTitle,
  range,
  schema: 'machines'
})

const result = await writeFiles({
  records,
  folder: 'machines',
  slugKey: 'modelId',
  orderKey: 'pageOrder',
  outputFormat: 'yaml', // 'frontmatter' | 'json' | 'yaml'
  overwriteMode: 'overwrite' // 'overwrite' | 'skip' | 'overwrite-frontmatter'
})
```

## Workflow Composable

`useGoogleSheetsImportWorkflow` is used by the module components to share state and actions between source selection and execute/write steps.

```ts
const workflow = useGoogleSheetsImportWorkflow()

// source step
workflow.source.spreadsheetId = '...'
await workflow.loadSheetTitles(workflow.source.spreadsheetId)

// execute step
await workflow.loadValues()
await workflow.writeValues()
```

You can use this composable directly for custom UIs while keeping module behavior consistent.

## Auto-imported Types

- `GoogleSheetsApiValues`
- `GoogleSheetsApiValuesResponse`
- `GoogleSheetsApiSheet`
- `GoogleSheetsApiSheetResponse`
- `ProductObject`
- `TransformedGoogleSheetsApiResult`

## API Endpoints

- `GET {apiBase}/sheets`
  - Query: `spreadsheetId`
  - Returns: sheet labels + computed default range (`A:<lastColumn>`)

- `GET {apiBase}/collection-type`
  - Query: `schema`
  - Returns: resolved `collectionType` (`page` | `data` | `unknown`) and `baseContentDir`
  - Used by the Step 2 UI preview so displayed destination matches server write behavior

- `GET {apiBase}/schema-columns`
  - Query: `schema?`
  - Returns:
    - `schemas`: available schema keys
    - `columns`: expected import header names for selected schema
    - `collectionType`: `page | data | unknown`
    - `pageOverrideColumns`: Nuxt Content page override fields (when `collectionType === 'page'`)

- `POST {apiBase}/values`
  - Body: `spreadsheetId`, `sheetTitle`, `range`, `schema`
  - Returns: `headers`, validated `records`, validation `errors`

- `POST {apiBase}/write`
  - Body: `records`, `schema?`, `folder`, `slugKey`, `orderKey?`, `contentDir?`, `outputFormat?`, `overwriteMode?`
  - `outputFormat`: `frontmatter` (default, `.md`), `json` (`.json`), `yaml` (`.yml`)
  - `overwriteMode`:
    - `overwrite` (default): replace target file content
    - `skip`: do not write if file already exists
    - `overwrite-frontmatter`: for `.md` frontmatter output, only replace frontmatter and retain existing markdown body
  - If `contentDir` is not provided, destination is resolved from `content.config.ts` collection `type` using `schema`:
    (using `googleSheetsImport.collectionTypeBySchema` first, then `content.config.ts` parser fallback)
    - `type: 'page'` -> `content/{folder}`
    - `type: 'data'` -> `content/data/{folder}`
  - Writes one file per validated record
  - Response:

```json
{
  "count": 42,
  "logs": ["/abs/path/content/machines/10.machine-a.md"],
  "contentDir": "content",
  "summary": {
    "written": 30,
    "overwritten": 8,
    "skipped": 4
  }
}
```

## Sheet Header Mapping Format

Headers map to schema paths:

- Flat field: `machineName`
- Nested object: `features.title`
- Array element: `benefits[0].title`
- Nested array/object: `items[0].meta.label`

The transformer:
- Splits comma-delimited cell values for array fields
- Coerces booleans (`true/false/1/0/yes/no`)
- Coerces numbers where possible
- Preserves optional/nullable behavior based on schema wrappers

## Refactor recommendation

Current split is valid and gives good separation of concerns:
- `GoogleSheetsImportSource` = source selection
- `GoogleSheetsImportExecute` = validate + write pipeline

If you want cleaner long-term architecture, keep shared state/actions in `useGoogleSheetsImportWorkflow` and keep UI concerns in the two focused components (`GoogleSheetsImportSource`, `GoogleSheetsImportExecute`). That enables:
- Reusing workflow logic in custom UIs
- Easier unit testing of the import/write process
- Keeping component templates simpler
