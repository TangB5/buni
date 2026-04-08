#!/bin/bash
# Migration depuis avs-frontend vers le monorepo Buni
# Usage : ./tools/migrate-from-avs.sh ../avs-frontend
set -e
SRC=${1:-"../avs-frontend"}
echo "→ Migration depuis $SRC..."
[ -d "$SRC/src/theme/patterns" ] && cp -r "$SRC/src/theme/patterns/." packages/patterns/src/css/ && echo "  ✓ patterns CSS"
[ -d "$SRC/src/theme/tokens"   ] && cp -r "$SRC/src/theme/tokens/."   packages/tokens/src/css/  && echo "  ✓ tokens CSS"
[ -d "$SRC/public/patterns"    ] && { mkdir -p packages/icons/src/assets; cp -r "$SRC/public/patterns/." packages/icons/src/assets/; echo "  ✓ SVG patterns"; }
[ -d "$SRC/src/features/auth/types" ] && cp -r "$SRC/src/features/auth/types/." packages/auth/src/types/ && echo "  ✓ auth types"
[ -f "$SRC/src/core/utils/svg-patterns.ts" ] && cp "$SRC/src/core/utils/svg-patterns.ts" packages/patterns/src/registry.ts && echo "  ✓ SVG registry"
echo ""; echo "✅ Migration terminée ! Vérifiez les imports dans chaque fichier copié."
