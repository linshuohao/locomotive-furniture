export const HERO_DEPTH_FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_texture;
  uniform float u_time;
  uniform float u_scroll;
  uniform float u_intro;
  uniform vec2 u_mouse;
  varying vec2 v_uv;

  vec2 perspectiveTilt(vec2 uv, float tiltX, float tiltY) {
    vec2 centered = uv - 0.5;
    float depth = 1.0 + centered.x * tiltY + centered.y * tiltX;
    return centered / depth + 0.5;
  }

  void main() {
    float tiltX = u_mouse.y * 0.11 + u_scroll * 0.07;
    float tiltY = u_mouse.x * 0.11;

    vec2 uv = perspectiveTilt(v_uv, tiltX, tiltY);
    uv = (uv - 0.5) / mix(1.18, 1.0, u_intro) + 0.5;

    float wave = sin(uv.y * 16.0 + u_time * 0.75) * 0.005;
    wave += sin(uv.x * 11.0 - u_time * 0.5) * 0.003;
    uv += vec2(wave, wave * 0.45);
    uv.y += u_scroll * 0.055;

    float aber = length(v_uv - 0.5) * 0.014;
    float r = texture2D(u_texture, uv + vec2(aber, aber * 0.35)).r;
    float g = texture2D(u_texture, uv).g;
    float b = texture2D(u_texture, uv - vec2(aber, aber * 0.35)).b;
    vec3 color = vec3(r, g, b);

    float vignette = smoothstep(1.2, 0.28, distance(v_uv, vec2(0.5)));
    color *= mix(0.76, 1.0, vignette);

    float scan = sin(v_uv.y * 720.0 + u_time * 2.0) * 0.012;
    color -= scan;

    gl_FragColor = vec4(color, 1.0);
  }
`

export const REVEAL_MASK_FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_texture;
  uniform float u_time;
  uniform float u_scroll;
  varying vec2 v_uv;

  void main() {
    float wave = sin(v_uv.y * 12.0 + u_time * 0.8) * 0.012;
    wave += sin(v_uv.x * 8.0 - u_time * 0.5) * 0.008;
    vec2 uv = v_uv + vec2(wave, wave * 0.6);
    uv.y += u_scroll * 0.04;
    vec4 color = texture2D(u_texture, uv);
    float vignette = smoothstep(1.2, 0.35, distance(v_uv, vec2(0.5)));
    color.rgb *= mix(0.82, 1.0, vignette);
    gl_FragColor = vec4(color.rgb, color.a * 0.92);
  }
`
