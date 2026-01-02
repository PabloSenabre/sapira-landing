// Liquid Glass WebGL Shaders
// Based on bergice/liquidglass - adapted for overlay-only rendering
// Canvas is fully transparent except where glass elements are rendered

export const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  
  void main() {
    v_uv = vec2(a_position.x, -a_position.y) * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Fragment shader - TRANSPARENT by default, only renders glass effects where elements exist
export const fragmentShaderSource = `
  precision mediump float;
  
  uniform float u_dpr;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  
  // Glass elements: [x, y, width, height] for each element
  uniform vec4 u_elements[8];
  uniform int u_elementCount;
  uniform float u_elementRadius[8];
  uniform float u_elementIntensity[8];
  
  // Ambient cursor spotlight
  uniform vec2 u_cursorPos;
  uniform float u_cursorSize;
  uniform float u_cursorActive;
  
  varying vec2 v_uv;
  
  float roundedBox(vec2 uv, vec2 center, vec2 size, float radius) {
    vec2 q = abs(uv - center) - size + radius;
    return length(max(q, 0.0)) - radius;
  }
  
  float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + vec2(r);
    return length(max(d, 0.0)) - r;
  }
  
  vec2 getNormal(vec2 uv, vec2 center, vec2 size, float radius, vec2 resolution) {
    vec2 eps = vec2(1.0) / resolution * 2.0;
    vec2 p = uv - center;
    
    float dx = (roundedBoxSDF(p + vec2(eps.x, 0.0), size, radius) - 
                roundedBoxSDF(p - vec2(eps.x, 0.0), size, radius)) * 0.5;
    float dy = (roundedBoxSDF(p + vec2(0.0, eps.y), size, radius) - 
                roundedBoxSDF(p - vec2(0.0, eps.y), size, radius)) * 0.5;
    
    vec2 gradient = vec2(dx, dy);
    
    float dxy1 = roundedBoxSDF(p + eps, size, radius);
    float dxy2 = roundedBoxSDF(p - eps, size, radius);
    vec2 diag = vec2(dxy1 - dxy2);
    
    gradient = mix(gradient, diag, 0.25);
    
    if (length(gradient) < 0.001) {
      return vec2(0.0);
    }
    return normalize(gradient);
  }
  
  // Render a single glass element - returns color with alpha
  // Transparent glass overlay with visible edge highlight
  vec4 renderGlassElement(vec2 pixelUV, vec2 center, vec2 size, float radius, float intensity) {
    vec2 local = (pixelUV - center) / size;
    local.y *= u_resolution.x / u_resolution.y;
    
    float dist = roundedBox(pixelUV, center, size, radius);
    
    // Outside the element - return transparent
    if (dist > 0.0) {
      return vec4(0.0);
    }
    
    float r = clamp(length(local * 1.0), 0.0, 1.0);
    
    // Edge highlight - bright rim only on edges
    float edgeGlow = 1.0 - smoothstep(-6.0, 0.0, dist);
    float sharpEdge = 1.0 - smoothstep(-2.0, 0.0, dist);
    
    // Pure white for all effects (transparent overlay)
    vec3 highlightColor = vec3(1.0, 1.0, 1.0);
    
    // Specular highlight spot in top-left
    vec2 specularPos = vec2(-0.25, -0.25);
    float specDist = length(local - specularPos);
    float specular = smoothstep(0.35, 0.0, specDist) * 0.4;
    
    // Center lens shine
    float centerShine = pow(1.0 - r, 2.5) * 0.25;
    
    // Final color is always white (additive overlay)
    vec3 color = highlightColor;
    
    // Alpha: mostly on edges + subtle center glow + specular
    float edgeAlpha = sharpEdge * 0.35;
    float glowAlpha = edgeGlow * 0.15;
    float finalAlpha = (edgeAlpha + glowAlpha + specular + centerShine * 0.15) * intensity;
    
    // Keep alpha very low to maintain transparency
    return vec4(color, clamp(finalAlpha, 0.0, 0.4));
  }
  
  // Render ambient cursor spotlight - subtle white glow following cursor
  vec4 renderCursorSpotlight(vec2 pixelUV) {
    if (u_cursorActive < 0.5) {
      return vec4(0.0);
    }
    
    vec2 center = u_cursorPos;
    float size = u_cursorSize;
    float dist = length(pixelUV - center);
    
    if (dist > size * 1.3) {
      return vec4(0.0);
    }
    
    float r = dist / size;
    
    // Soft radial falloff
    float falloff = 1.0 - smoothstep(0.0, 1.0, r);
    
    // Outer ring effect
    float ring = smoothstep(0.75, 0.9, r) * smoothstep(1.1, 0.95, r);
    
    // White color for overlay
    vec3 color = vec3(1.0, 1.0, 1.0);
    
    // Subtle alpha - just a hint of glow
    float alpha = falloff * 0.12 + ring * 0.2;
    
    return vec4(color, clamp(alpha, 0.0, 0.25));
  }
  
  void main() {
    vec2 pixelUV = (v_uv * u_resolution) / u_dpr;
    
    // Start with fully transparent
    vec4 finalColor = vec4(0.0, 0.0, 0.0, 0.0);
    
    // Render ambient cursor spotlight first (below other elements)
    vec4 cursor = renderCursorSpotlight(pixelUV);
    if (cursor.a > 0.0) {
      finalColor = vec4(
        mix(finalColor.rgb, cursor.rgb, cursor.a),
        max(finalColor.a, cursor.a)
      );
    }
    
    // Render each glass element
    for (int i = 0; i < 8; i++) {
      if (i >= u_elementCount) break;
      
      vec4 elem = u_elements[i];
      vec2 center = elem.xy;
      vec2 size = elem.zw * 0.5;
      float radius = u_elementRadius[i];
      float intensity = u_elementIntensity[i];
      
      // Skip if element has no size
      if (size.x < 1.0 || size.y < 1.0) continue;
      
      vec4 glass = renderGlassElement(pixelUV, center, size, radius, intensity);
      
      if (glass.a > 0.0) {
        // Alpha blend
        finalColor = vec4(
          mix(finalColor.rgb, glass.rgb, glass.a),
          max(finalColor.a, glass.a)
        );
      }
    }
    
    gl_FragColor = finalColor;
  }
`;

export interface GlassElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  intensity: number;
}

export interface CursorSpotlight {
  x: number;
  y: number;
  size: number;
  active: boolean;
}
