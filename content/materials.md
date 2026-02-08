---
title: Materials
description: Information about materials that can be processed on Metzner machines 
navigation:
  title: Materials
seo:
  title: Materials
  description: Information about materials that can be processed on Metzner machines
categories:
  - id: crossSection
    title: Cross section
    collection: Profile
    order: 1
  - id: longitudinalSection
    title: Longitudinal section
    collection: Stiffness
    order: 2
  - id: diameter
    title: Dimensions
    collection: Diameter
    order: 3
  - id: widthHeight
    title: Dimensions
    collection: Width & height
    order: 4
attributes:
  - id: shape
    categoryId: crossSection
    legend: Shape
    description: 
      Is the material a pipe, hose, conduit or cord with a round cross section?
      Or does it have a more complex profile?
  - id: core
    categoryId: crossSection
    legend: Core
    description: 
      Is the core of the material solid or hollow? Complex profiles may have
      both solid and hollow portions.
  - id: reinforced
    categoryId: crossSection
    legend: Reinforced
    description: Is there steel reinforcement running along the length of the material?
  - id: stiffness
    categoryId: longitudinalSection
    legend: Stiffness
    description: 
      Is the material a flexible hose, cord or profile? Or is it a rigid pipe or
      extrusion?
  - id: cutDiameter
    categoryId: diameter
    legend: Diameter
    description: What is the outer diameter of the material cross section?
    unit: mm
  - id: cutWidth
    categoryId: widthHeight
    legend: Width
    description: What is the width of the material cross section?
    unit: mm
  - id: cutHeight
    categoryId: widthHeight
    legend: Height
    description: What is the height of the material cross section?
    unit: mm
attributeValues:
  - id: round
    label: Round
    attributeId: shape
  - id: profile
    label: Profile
    attributeId: shape
  - id: complex
    label: Complex
    attributeId: shape  
  - id: solid
    label: Solid
    attributeId: core
  - id: hollow
    label: Hollow
    attributeId: core
  - id: mixed
    label: Mixed
    attributeId: core
  - id: steel
    label: Steel
    attributeId: reinforced
  - id: none
    label: None
    attributeId: reinforced
  - id: flexible
    label: Flexible
    attributeId: stiffness
  - id: rigid
    label: Rigid
    attributeId: stiffness    
headerCopy:
  title: Material Picker
  description: 
    Specify the material you need to cut, and we'll identify the most suitable
    cutting machines from our range.  
sitemap:
  loc: /materials
---

Metzner cutting machines are designed to handle a wide variety of materials used in industries such as packaging, printing, textiles, and plastics. Below is an overview of the types of materials that can be efficiently processed using Metzner equipment:
