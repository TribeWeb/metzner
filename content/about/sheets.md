---
title: Get Products
navigation:
  icon: i-lucide-file-text
  badge:
  label: Get Content
sheets:
  - Unique
  - Products
  - dc-dc-converters
  - machines
  - machines
googleSheets:
  - label: Metzner
    id: 1NKS0cTX6u5urtgQ3Q4Z2motiR2-9JmyPxcd05yVc1bc
  - label: Power
    id: 1aiWp4kqvyRzvy81i4wzxSVraMtIk_Y1cTdwwZ0NC3zk
googleSheets1:
  - source:
      label: Metzner
      id: 1NKS0cTX6u5urtgQ3Q4Z2motiR2-9JmyPxcd05yVc1bc
      sheetTitle: Machines
      range: A:Z
    destination:
      root: ../../content/
      folder: machines
      type: frontmatter # frontmatter | json | yaml
      slug: slug
  - source:
      label: Power
      id: 1aiWp4kqvyRzvy81i4wzxSVraMtIk_Y1cTdwwZ0NC3zk
contentFolderPath: "../../content/"
---

# Get Products from Google Sheets

Get the products from Google Sheets and create `.md` files in the `content` folder.

contentFolderPath: <ProseCode>{{ $doc.contentFolderPath }}</ProseCode>

::google-sheets{:googleSheets="googleSheets"} ::
