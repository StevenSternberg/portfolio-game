# Request

We want to codify the design of an application into a design system. This is a
creative process and needs to be done thoughtfully and creatively -- always
staying true to the design concepts and principles found in this current design.

To do this we will be creating a design concept and a design system. The design
concept will be used to guide the creation of the design system. The design system
will be used to create the application going forward.

There will be two main outputs from this process:
- a design concept
- a design system

# Design Concept

A design concept is a high-level description of the design of an application. It
is a collection of design principles and guidelines that are used to create a
design system. This is a document typically created by a creative director or
designer. It is a document that is used to guide the creation of a design system.

## Analyze Design

Deeply analyze the design of the current application to create a
design concept file in this project that describes the style and
design of every UI component needed in a design system at a high level, like a
creative director.

Capture high-level guidelines for:
- structure
- spacing
- fonts
- colors
- design style
- design principles

The goal with this file is to instruct AI to be able to replicate this look
easily in this project.

## Output
Output your design concept into the design concept file path from the output
file inputs at the end of this prompt.

# Design System

Use the design concept to guide the creation of the design system.

## Design a Design System

We are creating a DESIGN SYSTEM from the design found in this application. This
application does not have all components found in a design system. We need to
create a design system that includes many common components found in the
applications. This is a creative process and needs to be done thoughtfully and
creatively -- always staying true to the design concepts and principles found in
this current design.

## Intention
We want to outline the exact styling for all components and styles in this app,
along with high-level design guidelines, as there may be future components created
and it should be clear to the building agent how to create new styles for it.

## Output
Output your design system into the design system file path from the output
file inputs at the end of this prompt.

Output file inputs (edit only these lines):
- Design concept file path: docs/design_concept.json
- Design system file path: docs/design-system.json
