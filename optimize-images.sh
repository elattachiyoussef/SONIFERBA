#!/bin/bash

# Script d'optimisation des images pour améliorer le LCP

# Installer les dépendances si nécessaires
if ! command -v convert &> /dev/null; then
    echo "ImageMagick n'est pas installé. Installation en cours..."
    apt-get update && apt-get install -y imagemagick
fi

# Optimiser les images critiques pour le LCP
echo "Optimisation des images critiques..."

# Optimiser l'image d'arrière-plan du hero
convert assets/images/hero-bg.jpg -strip -quality 80 -resize 1920x1080 -sampling-factor 4:2:0 -interlace Plane assets/images/hero-bg.optimized.jpg
mv assets/images/hero-bg.optimized.jpg assets/images/hero-bg.jpg

# Optimiser le logo
convert assets/images/logo.png -strip -quality 90 assets/images/logo.optimized.png
mv assets/images/logo.optimized.png assets/images/logo.png

# Créer des versions WebP pour les navigateurs modernes
echo "Création des versions WebP..."
for img in assets/images/*.{jpg,png}; do
    if [ -f "$img" ]; then
        cwebp -q 80 "$img" -o "${img%.*}.webp"
    fi
done


echo "Optimisation terminée!" 