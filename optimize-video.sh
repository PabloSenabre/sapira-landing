#!/bin/bash

# Script to optimize video for web
# Requires ffmpeg: brew install ffmpeg

INPUT="public/videos/intro.mp4"
OUTPUT="public/videos/intro-optimized.mp4"

echo "Optimizing video for web..."

ffmpeg -i "$INPUT" \
  -c:v libx264 \
  -preset slow \
  -crf 28 \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  -vf "scale=1920:-2" \
  "$OUTPUT"

echo "Done! Original: $(du -h "$INPUT" | cut -f1)"
echo "Optimized: $(du -h "$OUTPUT" | cut -f1)"

