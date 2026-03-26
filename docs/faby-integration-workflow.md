# Flujo de integracion de `main` sobre `faby`

`faby` es la rama de producto. La base aprobada del proyecto es:

- interfaz en espanol
- arquitectura `Astro + React islands`
- rutas reales en Astro
- direccion de producto hacia biblioteca social

## Regla principal

Los cambios nuevos de `main` no se mezclan a ciegas. Se revisan y se portan de forma selectiva a `faby`.

## Proceso recomendado

1. Comprobar si `main` trae commits nuevos:

   ```bash
   git fetch origin
   git rev-list --left-right --count origin/main...faby
   ```

2. Revisar los archivos afectados en `main`.

3. Clasificar cada cambio:

- compatible con Astro y el espanol
- util pero necesita adaptacion manual
- regresivo o incompatible con la direccion actual

4. Adaptar manualmente solo lo util sobre la estructura actual de `faby`.

## Fuentes de verdad

- `src/data/site.ts`: contenido base en espanol
- `src/lib/sanctuary/store.ts`: estado local del santuario, Pomodoro, avatar, cronicas e hitos
- `src/pages/*.astro`: shells de rutas reales

## Guardrails

- No volver a la SPA anterior.
- No reintroducir copy principal en ingles salvo la marca `Scholar's Sanctuary`.
- No publicar archivos de referencia visual dentro de `src/pages`.
- Las islas nuevas deben integrarse dentro de shells Astro, no sustituirlos.
