/* Mako's World — original 2D browser platformer. No Nintendo, SpongeBob, or other franchise art, names, music, sprites, or logos. */
(function () {
  "use strict";

  var WORLD_HEIGHT = 450;
  var GAME_WIDTH = 800;
  var GAME_HEIGHT = 450;
  var GROUND_TOP = 418;
  var MOVE_SPEED = 210;
  var JUMP_VELOCITY = -500;
  var SPRING_VELOCITY = -840;
  var WATER_MOVE_SPEED = 170;
  var WATER_JUMP_VELOCITY = -400;
  var WATER_BOUNCE_VELOCITY = -540;
  var ENEMY_SPEED = 70;
  var START_LIVES = 3;
  var INVULN_MS = 1000;
  var PLAYER_START_X = 80;
  var PLAYER_START_Y = 340;

  var MAX_LEVEL = 10;
  var LEVEL_NAMES = {
    4: "Beach",
    5: "Pirate Ships",
    6: "Sky Peaks",
    7: "Crystal Cave",
    8: "Frost Fields",
    9: "Volcano",
    10: "Boss: Rustclaw"
  };

  function readStartLevel(data) {
    if (data && typeof data.level === "number" && data.level >= 1 && data.level <= MAX_LEVEL && Math.floor(data.level) === data.level) {
      return data.level;
    }
    try {
      var n = parseInt(new URLSearchParams(window.location.search).get("level"), 10);
      if (n >= 1 && n <= MAX_LEVEL) {
        return n;
      }
    } catch (err) {
      // ignore malformed query strings
    }
    return 1;
  }

  function makeTextures(scene) {
    var g;
    var i;

    // Kid hero, shaded so he reads rounder and deeper (light from the top-left). Teal cap, yellow shirt,
    // navy shorts, white sneakers. Original look. Same 32x48 size and proportions as before.
    g = scene.make.graphics({ add: false });
    // sneakers: shadow tone, base, highlight, stripe, sole
    g.fillStyle(0xbfc4c9, 1);
    g.fillRoundedRect(3, 40, 12, 8, 3);
    g.fillRoundedRect(17, 40, 12, 8, 3);
    g.fillStyle(0xf4f4f4, 1);
    g.fillRoundedRect(3, 40, 10, 6, 3);
    g.fillRoundedRect(17, 40, 10, 6, 3);
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(6, 41.5, 4, 2);
    g.fillEllipse(20, 41.5, 4, 2);
    g.fillStyle(0x2bb3a8, 1);
    g.fillRect(4, 43, 10, 2);
    g.fillRect(18, 43, 10, 2);
    g.fillStyle(0x2a2a2a, 1);
    g.fillRect(3, 46, 12, 2);
    g.fillRect(17, 46, 12, 2);
    // shorts: core shadow on the right, lit band on the left, seam
    g.fillStyle(0x1a2638, 1);
    g.fillRoundedRect(6, 30, 20, 12, 3);
    g.fillStyle(0x24344d, 1);
    g.fillRoundedRect(6, 30, 17, 11, 3);
    g.fillStyle(0x34496a, 1);
    g.fillRect(8, 31, 4, 8);
    g.fillStyle(0x141d2b, 1);
    g.fillRect(15.5, 34, 1, 7);
    // arms: lit left arm, shaded right arm
    g.fillStyle(0xffe0b3, 1);
    g.fillRoundedRect(2, 18, 5, 12, 2);
    g.fillStyle(0xe2b07f, 1);
    g.fillRoundedRect(25, 18, 5, 12, 2);
    g.fillStyle(0xf3c995, 1);
    g.fillRect(25, 18, 3, 11);
    g.fillStyle(0xfff0d6, 1);
    g.fillRect(2.5, 19, 1.5, 8);
    // shirt: stepped tone bands from shadow (right/bottom) to highlight (top-left)
    g.fillStyle(0xbf8f2e, 1);
    g.fillRoundedRect(6, 16, 20, 16, 5);
    g.fillStyle(0xd9a63a, 1);
    g.fillRoundedRect(6, 16, 18.5, 15, 5);
    g.fillStyle(0xf2c14e, 1);
    g.fillRoundedRect(6, 16, 16, 13.5, 5);
    g.fillStyle(0xffd873, 1);
    g.fillRoundedRect(7.5, 17, 9, 9, 4);
    g.fillStyle(0xffeaa8, 1);
    g.fillEllipse(10.5, 19.5, 5, 3);
    g.fillStyle(0xc99a35, 1);
    g.fillEllipse(16, 17, 9, 3);
    // hair at the sides
    g.fillStyle(0x2c1f16, 1);
    g.fillEllipse(6, 10, 6, 8);
    g.fillEllipse(26, 10, 6, 8);
    g.fillStyle(0x4a3424, 1);
    g.fillEllipse(5.5, 9, 3.5, 5);
    g.fillEllipse(25, 9, 3, 5);
    // head: core shadow lower-right, mid tone, lit tone, top-left highlight
    g.fillStyle(0xd9a174, 1);
    g.fillCircle(16, 11, 9);
    g.fillStyle(0xf0c191, 1);
    g.fillCircle(15.4, 10.5, 8.3);
    g.fillStyle(0xffdcb0, 1);
    g.fillCircle(14.8, 10, 7.2);
    g.fillStyle(0xffe9cc, 1);
    g.fillEllipse(12, 9, 6, 4);
    // rosy cheeks
    g.fillStyle(0xf29c84, 0.55);
    g.fillCircle(10.5, 14, 1.8);
    g.fillCircle(21.5, 14, 1.8);
    // cap: dark rim, base, soft shadow on the face under the brim, brim, lit dome, specular
    g.fillStyle(0x0f5550, 1);
    g.fillEllipse(16, 6.5, 22, 12);
    g.fillStyle(0x1a8f86, 1);
    g.fillEllipse(15.5, 6, 21, 11);
    g.fillStyle(0xd09a6c, 0.7);
    g.fillRect(9, 10, 18, 1.5);
    g.fillStyle(0x0f5550, 1);
    g.fillRect(16, 8.5, 14, 3);
    g.fillStyle(0x146f68, 1);
    g.fillRect(16, 8, 14, 2);
    g.fillStyle(0x2bb3a8, 1);
    g.fillEllipse(15, 4, 16, 7);
    g.fillStyle(0x52d0c4, 1);
    g.fillEllipse(12.5, 3, 8, 3.5);
    g.fillStyle(0xd8fbf7, 1);
    g.fillEllipse(11, 2.6, 3, 1.4);
    // eyes with a main glint and a tiny lower reflection
    g.fillStyle(0x1a1a1a, 1);
    g.fillCircle(13, 12, 1.8);
    g.fillCircle(19, 12, 1.8);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(12.4, 11.3, 0.8);
    g.fillCircle(18.4, 11.3, 0.8);
    g.fillStyle(0xffffff, 0.6);
    g.fillCircle(13.6, 12.8, 0.4);
    g.fillCircle(19.6, 12.8, 0.4);
    // friendly smile
    g.lineStyle(1.5, 0xb86a4c, 1);
    g.beginPath();
    g.arc(16, 14, 3, 0.15, Math.PI - 0.15, false);
    g.strokePath();
    g.generateTexture("kid", 32, 48);
    g.destroy();

    // Shark kid body, shaded (countershading bands, sheen, belly shadow, snout specular).
    // Same geometry as before: torpedo body, pointed snout, small pec fin, 5 gills, smaller eye, grin.
    // Fins are separate textures so they can wag. Hitbox stays on this 64x40 sprite.
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x9fb2bf, 1);
    g.fillEllipse(36, 27, 44, 10);
    g.fillStyle(0x143f57, 1);
    g.fillEllipse(34, 19.5, 48, 15);
    g.fillStyle(0x1e5a7a, 1);
    g.fillEllipse(34, 19, 47, 14);
    g.fillStyle(0x2f7398, 1);
    g.fillEllipse(34.5, 20, 46, 11);
    g.fillStyle(0x3f88ad, 1);
    g.fillEllipse(33.5, 17.5, 40, 7);
    g.fillStyle(0x5aa3c4, 1);
    g.fillEllipse(32, 16, 32, 4.5);
    g.fillStyle(0x9fd3ea, 0.9);
    g.fillEllipse(30, 15, 18, 2);
    // belly: white with a soft core-shadow band underneath
    g.fillStyle(0xc9d6de, 1);
    g.fillEllipse(36, 26.5, 44, 9);
    g.fillStyle(0xf5f7f8, 1);
    g.fillEllipse(36, 25.5, 42, 7);
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(34, 24.5, 26, 3);
    // tapered rear
    g.fillStyle(0x1e5a7a, 1);
    g.fillTriangle(8, 21, 22, 13, 22, 24);
    g.fillStyle(0x3f88ad, 1);
    g.fillTriangle(11, 20, 22, 14.5, 22, 18);
    g.fillStyle(0xdfe7ec, 1);
    g.fillTriangle(10, 21, 22, 21, 22, 27);
    // pointed conical snout with a lit upper face and a specular dot
    g.fillStyle(0x2f7398, 1);
    g.fillTriangle(48, 14, 63, 21, 48, 23);
    g.fillStyle(0x1e5a7a, 1);
    g.fillTriangle(48, 14, 63, 21, 54, 17);
    g.fillStyle(0x5aa3c4, 1);
    g.fillTriangle(48, 15.5, 60, 20, 50, 17.5);
    g.fillStyle(0xdfe7ec, 1);
    g.fillTriangle(48, 22, 63, 21, 48, 28);
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(48, 22.5, 60, 21.5, 49, 25);
    g.fillStyle(0xcfeefa, 1);
    g.fillCircle(57, 18.5, 0.9);
    // small swept pectoral fin, shaded
    g.fillStyle(0x143f57, 1);
    g.fillTriangle(30, 26, 22, 33, 33, 27);
    g.fillStyle(0x2f7398, 1);
    g.fillTriangle(30, 26, 24, 32, 32, 27);
    g.fillStyle(0x5aa3c4, 1);
    g.fillTriangle(30, 26.5, 26, 30, 31, 27);
    // 5 gill slits with a lit edge
    var gs;
    for (gs = 0; gs < 5; gs++) {
      g.lineStyle(1.4, 0x163044, 1);
      g.beginPath();
      g.moveTo(39 + gs * 2.4, 16);
      g.lineTo(37 + gs * 2.4, 25);
      g.strokePath();
      g.lineStyle(0.8, 0x7fbcd8, 0.7);
      g.beginPath();
      g.moveTo(39.9 + gs * 2.4, 16.5);
      g.lineTo(37.9 + gs * 2.4, 24);
      g.strokePath();
    }
    // smaller friendly eye with two highlights
    g.fillStyle(0xffffff, 1);
    g.fillCircle(52, 17, 3.2);
    g.fillStyle(0x163044, 1);
    g.fillCircle(52.5, 17, 1.9);
    g.fillStyle(0x0a1520, 1);
    g.fillCircle(52.8, 17, 1.1);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(53.6, 16.2, 0.8);
    g.fillStyle(0xffffff, 0.6);
    g.fillCircle(51.6, 18, 0.4);
    // friendly grin with small white triangle teeth
    g.lineStyle(1.4, 0x163044, 1);
    g.beginPath();
    g.moveTo(53, 25);
    g.lineTo(57, 27);
    g.lineTo(61, 24);
    g.strokePath();
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(54, 25, 55, 28, 56, 25);
    g.fillTriangle(56.5, 26, 57.5, 29, 58.5, 26);
    g.fillTriangle(59, 25, 60, 28, 61, 24);
    g.generateTexture("shark-kid", 64, 40);
    g.destroy();

    // Shorter triangular dorsal fin (origin at bottom center), shaded: lit leading edge, dark trailing edge
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x143f57, 1);
    g.fillTriangle(2, 21, 9, 1, 16, 21);
    g.fillStyle(0x2f7398, 1);
    g.fillTriangle(4, 21, 9, 6, 14, 21);
    g.fillStyle(0x5aa3c4, 1);
    g.fillTriangle(4, 21, 9, 4, 7.5, 21);
    g.fillStyle(0x9fd3ea, 0.8);
    g.fillTriangle(5, 20, 9, 6, 6.5, 20);
    g.fillStyle(0x1a4d6a, 1);
    g.fillTriangle(9, 1, 16, 21, 13, 21);
    g.generateTexture("shark-dorsal", 18, 22);
    g.destroy();

    // Smaller forked tail, both lobes, shaded. Attachment is the right edge. Still wags.
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x143f57, 1);
    g.fillTriangle(1, 1, 23, 14, 10, 13);
    g.fillTriangle(2, 27, 23, 14, 10, 15);
    g.fillStyle(0x2f7398, 1);
    g.fillTriangle(5, 4, 22, 14, 11, 13);
    g.fillTriangle(6, 24, 22, 14, 11, 15);
    g.fillStyle(0x5aa3c4, 1);
    g.fillTriangle(6, 5, 20, 13.5, 11, 12.5);
    g.fillStyle(0xdce6ec, 0.55);
    g.fillTriangle(8, 14, 22, 14, 9, 16);
    g.generateTexture("shark-tail", 24, 28);
    g.destroy();

    // Ground tile: grass over dirt
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x6b4423, 1);
    g.fillRect(0, 0, 64, 32);
    g.fillStyle(0x8a5a2b, 1);
    g.fillRect(0, 10, 64, 6);
    g.fillStyle(0x3d8f3d, 1);
    g.fillRect(0, 0, 64, 10);
    g.fillStyle(0x54b054, 1);
    g.fillRect(0, 0, 64, 4);
    g.fillStyle(0x2f6b2f, 1);
    for (i = 0; i < 8; i++) {
      g.fillRect(4 + i * 8, 4, 3, 3);
    }
    g.generateTexture("ground", 64, 32);
    g.destroy();

    // Sand floor
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xd2b47a, 1);
    g.fillRect(0, 0, 64, 32);
    g.fillStyle(0xe6c98a, 1);
    g.fillRect(0, 0, 64, 8);
    g.fillStyle(0xb8945a, 1);
    g.fillRect(0, 24, 64, 8);
    g.fillStyle(0xc4a468, 1);
    for (i = 0; i < 12; i++) {
      g.fillCircle(4 + (i * 11) % 64, 10 + (i * 7) % 18, 1.2);
    }
    g.generateTexture("sand", 64, 32);
    g.destroy();

    // Rock fill for the end pedestal
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x6d7a86, 1);
    g.fillRect(0, 0, 48, 48);
    g.fillStyle(0x8b98a4, 1);
    g.fillRect(0, 0, 48, 8);
    g.fillStyle(0x55616c, 1);
    g.fillRect(0, 40, 48, 8);
    g.fillStyle(0x7a8792, 1);
    g.fillEllipse(16, 22, 18, 12);
    g.fillEllipse(32, 30, 14, 10);
    g.generateTexture("rock", 48, 48);
    g.destroy();

    // Stair / obstacle blocks: warm sandstone
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xb8895a, 1);
    g.fillRect(0, 0, 48, 48);
    g.fillStyle(0xd4a574, 1);
    g.fillRect(0, 0, 48, 8);
    g.fillStyle(0x8d6240, 1);
    g.fillRect(0, 40, 48, 8);
    g.fillStyle(0xc49668, 1);
    g.fillRect(6, 14, 16, 10);
    g.fillRect(24, 26, 16, 10);
    g.fillStyle(0xa07048, 1);
    g.fillRect(0, 0, 48, 2);
    g.fillRect(0, 0, 2, 48);
    g.generateTexture("block", 48, 48);
    g.destroy();

    // Level 1 moving platform: warm sandstone, matches the stair blocks
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xb8895a, 1);
    g.fillRect(0, 0, 64, 16);
    g.fillStyle(0xd4a574, 1);
    g.fillRect(0, 0, 64, 4);
    g.fillStyle(0x8d6240, 1);
    g.fillRect(0, 13, 64, 3);
    g.fillStyle(0xc49668, 1);
    g.fillRect(8, 6, 18, 4);
    g.fillRect(36, 7, 16, 3);
    g.generateTexture("mover", 64, 16);
    g.destroy();

    // Spring / bouncy pad
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x3a3a44, 1);
    g.fillRect(6, 10, 28, 14);
    g.lineStyle(3, 0x6a6a78, 1);
    g.beginPath();
    g.moveTo(8, 22);
    g.lineTo(14, 12);
    g.lineTo(20, 22);
    g.lineTo(26, 12);
    g.lineTo(32, 22);
    g.strokePath();
    g.fillStyle(0xf0a020, 1);
    g.fillRoundedRect(2, 0, 36, 10, 3);
    g.fillStyle(0xffd060, 1);
    g.fillRoundedRect(4, 1, 32, 4, 2);
    g.generateTexture("spring", 40, 24);
    g.destroy();

    // Bubble platform: round, translucent
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xa8e8ff, 0.38);
    g.fillCircle(32, 32, 30);
    g.lineStyle(3, 0xffffff, 0.6);
    g.strokeCircle(32, 32, 30);
    g.lineStyle(2, 0x7ecfff, 0.4);
    g.strokeCircle(32, 32, 24);
    g.fillStyle(0xffffff, 0.5);
    g.fillEllipse(22, 20, 14, 8);
    g.fillStyle(0xffffff, 0.3);
    g.fillCircle(40, 38, 4);
    g.generateTexture("bubble-plat", 64, 64);
    g.destroy();

    // Rising bubble particle
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xffffff, 0.7);
    g.fillCircle(6, 6, 5);
    g.lineStyle(1, 0xb8e8ff, 0.8);
    g.strokeCircle(6, 6, 5);
    g.fillStyle(0xffffff, 0.9);
    g.fillCircle(4, 4, 1.5);
    g.generateTexture("bubble-dot", 12, 12);
    g.destroy();

    // Seaweed
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x1f6b4a, 1);
    g.fillEllipse(10, 40, 10, 48);
    g.fillStyle(0x2e8f62, 1);
    g.fillEllipse(20, 32, 8, 52);
    g.fillStyle(0x246f4e, 1);
    g.fillEllipse(28, 44, 9, 40);
    g.generateTexture("seaweed", 36, 64);
    g.destroy();

    // Distant kelp silhouette
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x0b3a3a, 1);
    g.fillEllipse(16, 70, 14, 100);
    g.fillEllipse(30, 50, 12, 90);
    g.fillEllipse(42, 80, 16, 80);
    g.generateTexture("kelp", 56, 130);
    g.destroy();

    // Water gradient strip
    g = scene.make.graphics({ add: false });
    g.fillGradientStyle(0x3aa0c0, 0x3aa0c0, 0x0d3c5a, 0x0d3c5a, 1);
    g.fillRect(0, 0, 8, 450);
    g.generateTexture("water-grad", 8, 450);
    g.destroy();

    // Jellyfish (original bell + short tentacles; not a franchise design)
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xf0b070, 0.85);
    g.fillEllipse(20, 16, 32, 24);
    g.fillStyle(0xffd8a0, 0.7);
    g.fillEllipse(20, 13, 22, 14);
    g.fillStyle(0xe89858, 0.9);
    g.fillEllipse(20, 22, 28, 8);
    g.lineStyle(2, 0xe89858, 0.85);
    g.beginPath();
    g.moveTo(10, 24);
    g.lineTo(8, 36);
    g.lineTo(12, 48);
    g.moveTo(16, 24);
    g.lineTo(14, 38);
    g.lineTo(16, 50);
    g.moveTo(24, 24);
    g.lineTo(26, 38);
    g.lineTo(24, 50);
    g.moveTo(30, 24);
    g.lineTo(32, 36);
    g.lineTo(28, 48);
    g.strokePath();
    g.generateTexture("jelly", 40, 52);
    g.destroy();

    // Lazy octopus head
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xc46b4a, 1);
    g.fillCircle(36, 36, 28);
    g.fillStyle(0xd88966, 1);
    g.fillCircle(30, 30, 10);
    // sleepy eyes
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(26, 34, 14, 10);
    g.fillEllipse(46, 34, 14, 10);
    g.fillStyle(0x3a2a20, 1);
    g.fillEllipse(26, 36, 10, 3);
    g.fillEllipse(46, 36, 10, 3);
    g.fillStyle(0x3a2a20, 1);
    g.fillRect(20, 28, 12, 2);
    g.fillRect(40, 28, 12, 2);
    // tiny sleepy smile
    g.lineStyle(1.6, 0x8a4030, 1);
    g.beginPath();
    g.arc(36, 44, 4, 0.2, Math.PI - 0.2, false);
    g.strokePath();
    g.generateTexture("octopus", 72, 64);
    g.destroy();

    // Octopus arm (decorative)
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xc46b4a, 1);
    g.fillEllipse(24, 12, 44, 14);
    g.fillStyle(0xd88966, 1);
    g.fillEllipse(10, 12, 14, 10);
    g.fillStyle(0xa8583a, 1);
    g.fillCircle(8, 12, 2);
    g.fillCircle(16, 14, 2);
    g.fillCircle(24, 10, 2);
    g.generateTexture("octo-arm", 48, 24);
    g.destroy();

    // Bounce pad at arm tip (same palette, slightly puffy)
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xc46b4a, 1);
    g.fillCircle(12, 12, 12);
    g.fillStyle(0xe0a07a, 1);
    g.fillCircle(12, 10, 7);
    g.fillStyle(0xffffff, 0.35);
    g.fillCircle(9, 8, 3);
    g.generateTexture("octo-pad", 24, 24);
    g.destroy();

    // Treasure chest goal
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x6b3e1f, 1);
    g.fillRoundedRect(4, 22, 48, 26, 3);
    g.fillStyle(0x8a5428, 1);
    g.fillRoundedRect(4, 10, 48, 16, 3);
    g.fillStyle(0xd4a017, 1);
    g.fillRect(4, 20, 48, 5);
    g.fillRect(24, 22, 8, 26);
    g.fillStyle(0xffe566, 1);
    g.fillCircle(28, 32, 4);
    g.fillStyle(0xffe566, 0.7);
    g.fillEllipse(28, 8, 16, 6);
    g.generateTexture("chest", 56, 48);
    g.destroy();

    // Enemy: Bramble
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x5a2d6e, 1);
    g.fillTriangle(6, 10, 12, 0, 16, 10);
    g.fillTriangle(16, 10, 20, 0, 26, 10);
    g.fillStyle(0x7a3d92, 1);
    g.fillRoundedRect(2, 8, 28, 22, 7);
    g.fillStyle(0xf0d44a, 1);
    g.fillCircle(11, 18, 4);
    g.fillCircle(21, 18, 4);
    g.fillStyle(0x1a1a1a, 1);
    g.fillCircle(11, 18, 2);
    g.fillCircle(21, 18, 2);
    g.fillStyle(0x3d1a4a, 1);
    g.fillRect(6, 28, 8, 4);
    g.fillRect(18, 28, 8, 4);
    g.generateTexture("bramble", 32, 32);
    g.destroy();

    // Coin
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xd4a017, 1);
    g.fillCircle(10, 10, 10);
    g.fillStyle(0xffe566, 1);
    g.fillCircle(10, 10, 7);
    g.fillStyle(0xd4a017, 1);
    g.fillRect(9, 4, 2, 12);
    g.fillStyle(0xffffff, 0.7);
    g.fillCircle(7, 7, 2);
    g.generateTexture("coin", 20, 20);
    g.destroy();

    // Goal flag
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x4a4a4a, 1);
    g.fillRect(6, 0, 6, 112);
    g.fillStyle(0x2a2a2a, 1);
    g.fillRect(4, 108, 10, 8);
    g.fillStyle(0x1a8f86, 1);
    g.fillTriangle(12, 6, 52, 22, 12, 40);
    g.fillStyle(0x2bb3a8, 1);
    g.fillTriangle(12, 10, 44, 22, 12, 36);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(22, 22, 4);
    g.generateTexture("flag", 56, 116);
    g.destroy();

    // Distant hill
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x4e8f7b, 1);
    g.fillEllipse(120, 90, 240, 140);
    g.fillStyle(0x3c7a68, 1);
    g.fillEllipse(40, 110, 140, 100);
    g.fillEllipse(200, 110, 160, 110);
    g.generateTexture("hills", 240, 140);
    g.destroy();

    // Cloud
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xffffff, 0.9);
    g.fillCircle(28, 24, 16);
    g.fillCircle(48, 20, 22);
    g.fillCircle(70, 24, 16);
    g.fillCircle(50, 32, 18);
    g.generateTexture("cloud", 90, 50);
    g.destroy();
  }

  function addPlatform(scene, x, y, width, height, texture) {
    var sprite = scene.add.tileSprite(x + width / 2, y + height / 2, width, height, texture);
    scene.physics.add.existing(sprite, true);
    sprite.body.updateFromGameObject();
    scene.platforms.add(sprite);
    return sprite;
  }

  function addMovingPlatform(scene, x, y, width, minX, maxX, speed) {
    var plat = scene.add.tileSprite(x, y, width, 16, "mover");
    scene.physics.add.existing(plat);
    scene.movingPlatforms.add(plat);
    plat.body.allowGravity = false;
    plat.body.immovable = true;
    plat.body.setSize(width, 16);
    plat.body.setVelocityX(speed);
    plat.minX = minX;
    plat.maxX = maxX;
    plat.moveSpeed = Math.abs(speed);
    return plat;
  }

  function addCoin(scene, x, y) {
    return scene.coins.create(x, y, "coin");
  }

  function addSpring(scene, x, y) {
    var spring = scene.springs.create(x, y, "spring");
    spring.refreshBody();
    return spring;
  }

  function addBramble(scene, x, y) {
    var enemy = scene.enemies.create(x, y, "bramble");
    enemy.setVelocityX(ENEMY_SPEED);
    enemy.setCollideWorldBounds(true);
    enemy.body.setSize(26, 24);
    enemy.body.setOffset(3, 8);
    enemy.setBounce(0);
    enemy.setMaxVelocity(ENEMY_SPEED, 800);
    return enemy;
  }

  function addStaircase(scene, startX, steps, stepW, stepRise, extraTop) {
    var i;
    var lastTop = GROUND_TOP;
    for (i = 0; i < steps; i++) {
      var height = (i + 1) * stepRise;
      var top = GROUND_TOP + 32 - height;
      addPlatform(scene, startX + i * stepW, top, stepW, height, "block");
      lastTop = top;
    }
    var landingX = startX + steps * stepW;
    var landingW = extraTop || 360;
    addPlatform(scene, landingX, lastTop, landingW, 24, "block");
    return { landingX: landingX, landingW: landingW, landingTop: lastTop };
  }

  function addSeaweed(scene, x, groundTop) {
    var weed = scene.add.image(x, groundTop, "seaweed").setOrigin(0.5, 1).setDepth(3);
    scene.tweens.add({
      targets: weed,
      angle: 8,
      duration: 1800 + (x % 7) * 80,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
    return weed;
  }

  function addBubblePlatform(scene, x, y) {
    var bubble = scene.physics.add.sprite(x, y, "bubble-plat");
    bubble.body.allowGravity = false;
    bubble.body.moves = false;
    bubble.setImmovable(true);
    bubble.body.setCircle(26, 6, 6);
    bubble.body.checkCollision.down = false;
    bubble.body.checkCollision.left = false;
    bubble.body.checkCollision.right = false;
    bubble.body.updateFromGameObject();
    scene.bubblePlatforms.add(bubble);
    scene.tweens.add({
      targets: bubble,
      y: y - 8,
      duration: 1400 + (x % 5) * 120,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      onUpdate: function () {
        if (bubble.body) {
          bubble.body.updateFromGameObject();
        }
      }
    });
    return bubble;
  }

  function addJelly(scene, x, y, travel) {
    var jelly = scene.physics.add.sprite(x, y, "jelly");
    jelly.body.allowGravity = false;
    jelly.body.moves = false;
    jelly.setImmovable(true);
    jelly.body.setSize(24, 22);
    jelly.body.setOffset(8, 4);
    jelly.body.updateFromGameObject();
    scene.jellies.add(jelly);
    scene.tweens.add({
      targets: jelly,
      y: y - (travel || 70),
      duration: 1700 + (x % 6) * 80,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      onUpdate: function () {
        if (jelly.body) {
          jelly.body.updateFromGameObject();
        }
      }
    });
    return jelly;
  }

  function addOctopus(scene, x, groundTop) {
    var body = scene.add.image(x, groundTop - 10, "octopus").setOrigin(0.5, 1).setDepth(6);
    scene.tweens.add({
      targets: body,
      angle: 6,
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
    var arms = [
      { ax: x - 42, ay: groundTop - 36, angle: -18 },
      { ax: x, ay: groundTop - 70, angle: -90 },
      { ax: x + 46, ay: groundTop - 40, angle: 18 }
    ];
    var i;
    for (i = 0; i < arms.length; i++) {
      var midX = (x + arms[i].ax) / 2;
      var midY = (groundTop - 24 + arms[i].ay) / 2;
      scene.add.image(midX, midY, "octo-arm").setAngle(arms[i].angle).setDepth(5);
      var pad = scene.springs.create(arms[i].ax, arms[i].ay, "octo-pad");
      pad.refreshBody();
    }
    return body;
  }

  function addRisingBubbles(scene) {
    var i;
    for (i = 0; i < 22; i++) {
      var bx = 30 + Math.floor(Math.random() * (scene.worldWidth - 60));
      var by = Math.floor(Math.random() * WORLD_HEIGHT);
      var img = scene.add.image(bx, by, "bubble-dot");
      img.setAlpha(0.28 + Math.random() * 0.3);
      img.setScale(0.6 + Math.random() * 0.8);
      img.setDepth(4);
      scene.tweens.add({
        targets: img,
        y: -24,
        duration: 4200 + Math.random() * 3800,
        delay: Math.random() * 800,
        repeat: -1,
        onRepeat: function (tween, target) {
          target.x = 30 + Math.floor(Math.random() * (scene.worldWidth - 60));
          target.y = WORLD_HEIGHT + 12;
        }
      });
    }
  }

  function buildLevel1(scene) {
    addPlatform(scene, 0, GROUND_TOP, 500, 32, "ground");
    addSpring(scene, 390, GROUND_TOP - 12);
    addPlatform(scene, 620, GROUND_TOP - 150, 48, 150, "block");
    addPlatform(scene, 920, GROUND_TOP, 480, 32, "ground");
    // Slow moving platform over the first pit, on the opening screen so the player can ride it
    addMovingPlatform(scene, 720, 328, 112, 680, 820, 32);
    addBramble(scene, 1120, GROUND_TOP - 20);
    addSpring(scene, 1320, GROUND_TOP - 12);
    addPlatform(scene, 1760, GROUND_TOP, 200, 32, "ground");

    var stairs = addStaircase(scene, 1960, 8, 56, 28, 420);
    scene.flag = scene.physics.add.staticSprite(
      stairs.landingX + stairs.landingW - 80,
      stairs.landingTop - 58,
      "flag"
    );
    scene.flag.refreshBody();
    scene.worldWidth = stairs.landingX + stairs.landingW + 80;
    scene.waterZones = [];

    var coins = [
      [260, 380], [480, 200], [644, 140], [820, 180],
      [1100, 380], [1400, 180], [1600, 150], [1860, 380],
      [2070, 320], [2180, 260], [2290, 200], [2480, stairs.landingTop - 40]
    ];
    var i;
    for (i = 0; i < coins.length; i++) {
      addCoin(scene, coins[i][0], coins[i][1]);
    }
  }

  function buildLevel2(scene) {
    addPlatform(scene, 0, GROUND_TOP, 420, 32, "ground");
    addSpring(scene, 330, GROUND_TOP - 12);
    addPlatform(scene, 560, GROUND_TOP - 170, 44, 170, "block");
    addPlatform(scene, 980, GROUND_TOP, 360, 32, "ground");
    addBramble(scene, 1120, GROUND_TOP - 20);
    addSpring(scene, 1260, GROUND_TOP - 12);
    addPlatform(scene, 1480, 250, 120, 20, "block");
    addPlatform(scene, 1860, GROUND_TOP, 160, 32, "ground");

    var startX = 2020;
    var stepW = 56;
    var stepRise = 26;
    var i;
    for (i = 0; i < 5; i++) {
      var h = (i + 1) * stepRise;
      addPlatform(scene, startX + i * stepW, GROUND_TOP + 32 - h, stepW, h, "block");
    }
    var midTop = GROUND_TOP + 32 - 5 * stepRise;
    addPlatform(scene, startX + 5 * stepW, midTop, 140, 24, "block");
    addBramble(scene, startX + 5 * stepW + 70, midTop - 20);
    var gapX = startX + 5 * stepW + 140;
    var resumeX = gapX + 90;
    var baseH = 5 * stepRise;
    for (i = 0; i < 6; i++) {
      var h2 = baseH + (i + 1) * stepRise;
      addPlatform(scene, resumeX + i * stepW, GROUND_TOP + 32 - h2, stepW, h2, "block");
    }
    var lastTop = GROUND_TOP + 32 - (baseH + 6 * stepRise);
    var landingX = resumeX + 6 * stepW;
    var landingW = 400;
    addPlatform(scene, landingX, lastTop, landingW, 24, "block");
    scene.flag = scene.physics.add.staticSprite(landingX + landingW - 80, lastTop - 58, "flag");
    scene.flag.refreshBody();
    scene.worldWidth = landingX + landingW + 80;
    scene.waterZones = [];

    var coins = [
      [220, 380], [400, 180], [582, 120], [780, 150],
      [1100, 380], [1320, 170], [1540, 210], [1940, 380],
      [2100, 330], [2210, 280], [gapX + 45, midTop - 70],
      [resumeX + 80, lastTop + 80], [landingX + 160, lastTop - 40]
    ];
    for (i = 0; i < coins.length; i++) {
      addCoin(scene, coins[i][0], coins[i][1]);
    }
  }

  function buildLevel3(scene) {
    scene.worldWidth = 3200;
    scene.waterZones = [{ x: 0, y: 0, width: scene.worldWidth, height: WORLD_HEIGHT }];

    var k;
    for (k = 0; k < 8; k++) {
      scene.add.image(180 + k * 420, 340, "kelp").setScrollFactor(0.22).setAlpha(0.35).setDepth(1);
    }

    addPlatform(scene, 0, GROUND_TOP, 640, 32, "sand");
    addPlatform(scene, 1080, GROUND_TOP, 620, 32, "sand");
    addPlatform(scene, 2300, GROUND_TOP, 900, 32, "sand");

    addSeaweed(scene, 140, GROUND_TOP);
    addSeaweed(scene, 300, GROUND_TOP);
    addSeaweed(scene, 560, GROUND_TOP);
    addSeaweed(scene, 1220, GROUND_TOP);
    addSeaweed(scene, 1680, GROUND_TOP);
    addSeaweed(scene, 2420, GROUND_TOP);
    addSeaweed(scene, 2880, GROUND_TOP);

    addJelly(scene, 430, 372, 72);

    addBubblePlatform(scene, 720, 310);
    addBubblePlatform(scene, 860, 250);
    addBubblePlatform(scene, 1000, 300);
    addJelly(scene, 860, 150, 55);

    addOctopus(scene, 1480, GROUND_TOP);

    addBubblePlatform(scene, 1680, 200);
    addBubblePlatform(scene, 1860, 150);
    addBubblePlatform(scene, 2060, 200);
    addBubblePlatform(scene, 2220, 260);
    addJelly(scene, 1860, 70, 50);
    addJelly(scene, 2100, 300, 64);

    addPlatform(scene, 2520, 340, 240, GROUND_TOP + 32 - 340, "rock");
    scene.flag = scene.physics.add.staticSprite(2640, 316, "chest");
    scene.flag.refreshBody();

    addRisingBubbles(scene);

    var coins = [
      [240, 380], [430, 280], [720, 250], [860, 190],
      [1000, 240], [1280, 380], [1480, 240], [1680, 140],
      [1860, 90], [2060, 140], [2220, 200], [2640, 280]
    ];
    var i;
    for (i = 0; i < coins.length; i++) {
      addCoin(scene, coins[i][0], coins[i][1]);
    }
  }

  // Textures for Levels 4-10 plus the player's drop shadow. All original, drawn in code.
  function makeWorldTextures(scene) {
    var g;
    var i;

    // Soft drop shadow under the player
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x000000, 0.16);
    g.fillEllipse(24, 7, 48, 14);
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(24, 7, 34, 10);
    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(24, 7, 20, 6);
    g.generateTexture("player-shadow", 48, 14);
    g.destroy();

    // Crumbling sand platform (cracked)
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xb8955a, 1);
    g.fillRect(0, 0, 96, 20);
    g.fillStyle(0xe0c48a, 1);
    g.fillRect(0, 0, 96, 15);
    g.fillStyle(0xf3dcaa, 1);
    g.fillRect(0, 0, 96, 4);
    g.lineStyle(1.5, 0x8c6c3a, 1);
    g.beginPath(); g.moveTo(18, 0); g.lineTo(24, 8); g.lineTo(20, 15); g.strokePath();
    g.beginPath(); g.moveTo(50, 2); g.lineTo(45, 10); g.lineTo(52, 19); g.strokePath();
    g.beginPath(); g.moveTo(76, 0); g.lineTo(82, 9); g.lineTo(78, 14); g.strokePath();
    g.fillStyle(0x8c6c3a, 1);
    for (i = 0; i < 6; i++) {
      g.fillCircle(8 + i * 16, 17, 1.4);
    }
    g.generateTexture("crumble", 96, 20);
    g.destroy();

    // Sideways crab (original)
    g = scene.make.graphics({ add: false });
    g.lineStyle(2, 0xa83a26, 1);
    for (i = 0; i < 3; i++) {
      g.beginPath(); g.moveTo(12, 18 + i * 2); g.lineTo(3, 24 + i * 1.5); g.strokePath();
      g.beginPath(); g.moveTo(28, 18 + i * 2); g.lineTo(37, 24 + i * 1.5); g.strokePath();
    }
    g.fillStyle(0x8a2c1c, 1);
    g.fillCircle(5, 11, 5);
    g.fillCircle(35, 11, 5);
    g.fillStyle(0xd9533b, 1);
    g.fillCircle(4.5, 10, 4);
    g.fillCircle(34.5, 10, 4);
    g.fillStyle(0x7a2416, 1);
    g.fillTriangle(1, 6, 6, 10, 0, 11);
    g.fillTriangle(39, 6, 34, 10, 40, 11);
    g.fillStyle(0x9e3220, 1);
    g.fillEllipse(20, 18, 28, 16);
    g.fillStyle(0xd9533b, 1);
    g.fillEllipse(19, 17, 26, 14);
    g.fillStyle(0xf07a5e, 1);
    g.fillEllipse(16, 14, 14, 6);
    g.fillStyle(0xffc2b0, 1);
    g.fillEllipse(14, 13, 5, 2);
    g.fillStyle(0xd9533b, 1);
    g.fillRect(14, 4, 2, 8);
    g.fillRect(24, 4, 2, 8);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(15, 4, 3);
    g.fillCircle(25, 4, 3);
    g.fillStyle(0x1a1a1a, 1);
    g.fillCircle(15.5, 4.3, 1.5);
    g.fillCircle(25.5, 4.3, 1.5);
    g.lineStyle(1.2, 0x5a1a10, 1);
    g.beginPath(); g.moveTo(16, 20); g.lineTo(20, 22); g.lineTo(24, 20); g.strokePath();
    g.generateTexture("crab", 40, 28);
    g.destroy();

    // Ship deck planks
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x8a5a2e, 1);
    g.fillRect(0, 0, 64, 20);
    g.fillStyle(0xa8723f, 1);
    g.fillRect(0, 0, 64, 16);
    g.fillStyle(0xc48b52, 1);
    g.fillRect(0, 0, 64, 3);
    g.fillStyle(0x5e3b1c, 1);
    g.fillRect(31, 0, 2, 20);
    g.fillRect(63, 0, 1, 20);
    g.fillCircle(4, 8, 1);
    g.fillCircle(36, 8, 1);
    g.generateTexture("deck", 64, 20);
    g.destroy();

    // Ship hull
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x3e2615, 1);
    g.fillRect(0, 0, 64, 64);
    for (i = 0; i < 4; i++) {
      g.fillStyle(0x5b3a21, 1);
      g.fillRect(0, i * 16 + 2, 64, 12);
      g.fillStyle(0x6e4a2c, 1);
      g.fillRect(0, i * 16 + 2, 64, 3);
    }
    g.generateTexture("hull", 64, 64);
    g.destroy();

    // Mast with sails and a teal fish emblem (original, no skulls or logos)
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x6b4423, 1);
    g.fillRect(66, 0, 8, 240);
    g.fillStyle(0x8a5a2b, 1);
    g.fillRect(66, 0, 3, 240);
    g.fillStyle(0xd9cfb4, 1);
    g.fillTriangle(74, 22, 74, 172, 138, 162);
    g.fillTriangle(66, 32, 66, 162, 8, 152);
    g.fillStyle(0xf3ead2, 1);
    g.fillTriangle(74, 26, 74, 160, 124, 152);
    g.fillTriangle(66, 36, 66, 150, 20, 144);
    g.fillStyle(0x2bb3a8, 1);
    g.fillEllipse(96, 110, 22, 10);
    g.fillTriangle(84, 110, 78, 104, 78, 116);
    g.fillTriangle(74, 0, 74, 14, 102, 7);
    g.generateTexture("mast", 140, 240);
    g.destroy();

    // Cannon (muzzle on the left)
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x2a2a30, 1);
    g.fillRoundedRect(2, 6, 38, 14, 6);
    g.fillStyle(0x55555f, 1);
    g.fillRect(6, 8, 28, 3);
    g.fillStyle(0x1a1a1e, 1);
    g.fillRect(0, 5, 5, 16);
    g.fillStyle(0x5e3b1c, 1);
    g.fillCircle(30, 24, 8);
    g.fillStyle(0x8a5a2b, 1);
    g.fillCircle(29, 23, 4);
    g.generateTexture("cannon", 48, 32);
    g.destroy();

    // Cannonball
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x1e1e24, 1);
    g.fillCircle(9, 9, 8);
    g.fillStyle(0x50505c, 1);
    g.fillCircle(6.5, 6.5, 3);
    g.fillStyle(0xb0b0bb, 1);
    g.fillCircle(5.5, 5.5, 1.2);
    g.generateTexture("cannonball", 18, 18);
    g.destroy();

    // Rope swing seat
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x7a4e26, 1);
    g.fillRoundedRect(0, 2, 72, 12, 4);
    g.fillStyle(0x9a6a3a, 1);
    g.fillRoundedRect(0, 2, 72, 9, 4);
    g.fillStyle(0xc48b52, 1);
    g.fillRect(3, 3, 66, 2);
    g.fillStyle(0x4a3424, 1);
    g.fillCircle(6, 4, 2.5);
    g.fillCircle(66, 4, 2.5);
    g.generateTexture("swing", 72, 14);
    g.destroy();

    // Mountain cliff tile with moss
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x6f6a64, 1);
    g.fillRect(0, 0, 64, 32);
    g.fillStyle(0x8a847c, 1);
    g.fillRect(0, 4, 64, 10);
    g.fillStyle(0x58534e, 1);
    g.fillCircle(14, 22, 4);
    g.fillCircle(44, 26, 5);
    g.fillStyle(0x5aa04a, 1);
    g.fillRect(0, 0, 64, 5);
    g.fillStyle(0x7cc066, 1);
    g.fillRect(0, 0, 64, 2);
    g.generateTexture("cliff", 64, 32);
    g.destroy();

    // Cloud platform
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xc9d8e6, 1);
    g.fillEllipse(32, 15, 64, 18);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(16, 10, 9);
    g.fillCircle(34, 9, 10);
    g.fillCircle(52, 11, 9);
    g.fillStyle(0xf2f8fc, 1);
    g.fillEllipse(30, 6, 24, 5);
    g.generateTexture("cloudplat", 64, 24);
    g.destroy();

    // Swoopet: original sky bird (faces right)
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x4b40a0, 1);
    g.fillTriangle(12, 12, 22, 12, 10, 0);
    g.fillTriangle(16, 12, 26, 12, 30, 1);
    g.fillStyle(0x4b40a0, 1);
    g.fillEllipse(20, 16, 26, 14);
    g.fillStyle(0x6b5fc7, 1);
    g.fillEllipse(19, 15, 23, 11);
    g.fillStyle(0x9a8fe8, 1);
    g.fillEllipse(17, 12, 12, 4);
    g.fillStyle(0xf2e6ff, 1);
    g.fillEllipse(21, 19, 14, 6);
    g.fillStyle(0x4b40a0, 1);
    g.fillTriangle(2, 14, 9, 12, 9, 18);
    g.fillStyle(0xffb347, 1);
    g.fillTriangle(31, 13, 39, 16, 31, 18);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(27, 12, 2.6);
    g.fillStyle(0x1a1a1a, 1);
    g.fillCircle(27.6, 12.2, 1.3);
    g.generateTexture("bird", 40, 28);
    g.destroy();

    // Duskflit: original cave bat (glowing eyes)
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x2a2238, 1);
    g.fillTriangle(0, 6, 16, 10, 8, 20);
    g.fillTriangle(40, 6, 24, 10, 32, 20);
    g.fillStyle(0x3a2f4f, 1);
    g.fillEllipse(20, 13, 16, 16);
    g.fillStyle(0x52466b, 1);
    g.fillEllipse(18, 10, 8, 5);
    g.fillTriangle(14, 6, 16, 0, 18, 6);
    g.fillTriangle(22, 6, 24, 0, 26, 6);
    g.fillStyle(0xffe066, 1);
    g.fillCircle(17, 12, 2);
    g.fillCircle(23, 12, 2);
    g.generateTexture("bat", 40, 24);
    g.destroy();

    // Wind streak
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xffffff, 0.75);
    g.fillRoundedRect(0, 2, 64, 2, 1);
    g.fillStyle(0xffffff, 0.4);
    g.fillRect(12, 0, 30, 1);
    g.fillRect(24, 5, 30, 1);
    g.generateTexture("windline", 64, 6);
    g.destroy();

    // Cave floor
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x2e2638, 1);
    g.fillRect(0, 0, 64, 32);
    g.fillStyle(0x3d3349, 1);
    g.fillRect(0, 0, 64, 9);
    g.fillStyle(0x5a4b6b, 1);
    g.fillRect(0, 0, 64, 2);
    g.fillStyle(0x7a6a8f, 1);
    g.fillCircle(10, 18, 1.5);
    g.fillCircle(38, 24, 1.5);
    g.fillCircle(54, 14, 1.2);
    g.generateTexture("cavefloor", 64, 32);
    g.destroy();

    // Glowing crystal cluster (origin bottom)
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x1f8fa8, 1);
    g.fillTriangle(5, 18, 0, 44, 10, 44);
    g.fillTriangle(25, 22, 20, 44, 30, 44);
    g.fillStyle(0x3fd6e6, 1);
    g.fillTriangle(15, 0, 8, 44, 22, 44);
    g.fillStyle(0x9ff5ff, 1);
    g.fillTriangle(15, 3, 11, 40, 15, 40);
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(14, 8, 12.5, 22, 14.5, 22);
    g.generateTexture("crystal", 30, 44);
    g.destroy();

    // Soft light glow (used with ADD blend)
    g = scene.make.graphics({ add: false });
    for (i = 10; i >= 1; i--) {
      g.fillStyle(0x7fffe8, 0.06);
      g.fillCircle(100, 100, i * 10);
    }
    g.generateTexture("glow", 200, 200);
    g.destroy();

    // Darkness overlay with a soft light hole in the middle (drawn once, it is big)
    if (!scene.textures.exists("darkness")) {
      g = scene.make.graphics({ add: false });
      var W = 1600;
      var H = 900;
      var cx = 800;
      var cy = 450;
      var radii = [130, 150, 170, 190, 210, 230, 250];
      var row;
      var ri;
      for (ri = 0; ri < radii.length; ri++) {
        var r = radii[ri];
        g.fillStyle(0x05040a, 0.25);
        for (row = 0; row < H; row += 3) {
          var dy = row + 1.5 - cy;
          if (Math.abs(dy) >= r) {
            g.fillRect(0, row, W, 3);
          } else {
            var hw = Math.sqrt(r * r - dy * dy);
            g.fillRect(0, row, cx - hw, 3);
            g.fillRect(cx + hw, row, W - (cx + hw), 3);
          }
        }
      }
      g.generateTexture("darkness", W, H);
      g.destroy();
    }

    // Ice tile
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x7fbfe0, 1);
    g.fillRect(0, 0, 64, 24);
    g.fillStyle(0xbfe6f7, 1);
    g.fillRect(0, 0, 64, 8);
    g.fillStyle(0xffffff, 1);
    g.fillRect(0, 0, 64, 2);
    g.lineStyle(2, 0xffffff, 0.6);
    g.beginPath(); g.moveTo(10, 18); g.lineTo(18, 10); g.strokePath();
    g.beginPath(); g.moveTo(40, 20); g.lineTo(50, 10); g.strokePath();
    g.generateTexture("ice", 64, 24);
    g.destroy();

    // Snow ground
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x9fb4c6, 1);
    g.fillRect(0, 0, 64, 32);
    g.fillStyle(0xe8f2fa, 1);
    g.fillRect(0, 0, 64, 12);
    g.fillStyle(0xffffff, 1);
    g.fillRect(0, 0, 64, 5);
    g.fillCircle(12, 5, 4);
    g.fillCircle(40, 6, 5);
    g.generateTexture("snow", 64, 32);
    g.destroy();

    // Frostwaddle: original penguin-like walker with a red scarf
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xff9f3a, 1);
    g.fillEllipse(10, 32, 9, 4);
    g.fillEllipse(22, 32, 9, 4);
    g.fillStyle(0x16223a, 1);
    g.fillEllipse(16, 19, 24, 26);
    g.fillStyle(0x1f2f4f, 1);
    g.fillEllipse(15, 18, 21, 23);
    g.fillStyle(0x3a4f78, 1);
    g.fillEllipse(12, 12, 8, 6);
    g.fillStyle(0xf4f7fb, 1);
    g.fillEllipse(16, 22, 15, 18);
    g.fillStyle(0xd9433b, 1);
    g.fillRect(6, 13, 20, 3);
    g.fillRect(20, 15, 4, 6);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(12, 9, 2.6);
    g.fillCircle(20, 9, 2.6);
    g.fillStyle(0x1a1a1a, 1);
    g.fillCircle(12.4, 9.3, 1.3);
    g.fillCircle(20.4, 9.3, 1.3);
    g.fillStyle(0xffb347, 1);
    g.fillTriangle(14, 11, 18, 11, 16, 14);
    g.generateTexture("waddler", 32, 34);
    g.destroy();

    // Rolling snowball
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xc9d8e6, 1);
    g.fillCircle(15, 15, 14);
    g.fillStyle(0xeef5fb, 1);
    g.fillCircle(13.5, 13.5, 12);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(11, 10, 5);
    g.fillStyle(0x3a4f78, 1);
    g.fillCircle(11, 16, 1.6);
    g.fillCircle(19, 16, 1.6);
    g.generateTexture("snowball", 30, 30);
    g.destroy();

    // Snowflake
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xffffff, 0.9);
    g.fillCircle(3, 3, 2.2);
    g.generateTexture("snowflake", 6, 6);
    g.destroy();

    // Volcano basalt
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x2a2422, 1);
    g.fillRect(0, 0, 64, 32);
    g.fillStyle(0x3a322e, 1);
    g.fillRect(0, 0, 64, 8);
    g.lineStyle(1.5, 0xff7a2a, 0.8);
    g.beginPath(); g.moveTo(8, 12); g.lineTo(16, 20); g.lineTo(12, 30); g.strokePath();
    g.beginPath(); g.moveTo(44, 10); g.lineTo(38, 22); g.strokePath();
    g.fillStyle(0xffb347, 1);
    g.fillCircle(52, 24, 1.4);
    g.generateTexture("basalt", 64, 32);
    g.destroy();

    // Lava
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xb8281a, 1);
    g.fillRect(0, 0, 64, 40);
    g.fillStyle(0xff6a1f, 1);
    g.fillRect(0, 0, 64, 12);
    g.fillStyle(0xffb347, 1);
    g.fillEllipse(16, 3, 22, 5);
    g.fillEllipse(48, 4, 18, 5);
    g.fillStyle(0xffe08a, 1);
    g.fillEllipse(14, 2, 8, 2);
    g.fillEllipse(46, 3, 6, 2);
    g.generateTexture("lava", 64, 40);
    g.destroy();

    // Fireball
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xff4a1a, 1);
    g.fillCircle(11, 12, 10);
    g.fillStyle(0xff9a2a, 1);
    g.fillCircle(10, 11, 7);
    g.fillStyle(0xffe08a, 1);
    g.fillCircle(9, 9, 3.5);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(8, 8, 1.2);
    g.generateTexture("fireball", 22, 22);
    g.destroy();

    // Boss arena steel
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x4a5566, 1);
    g.fillRect(0, 0, 64, 32);
    g.fillStyle(0x6a7788, 1);
    g.fillRect(0, 0, 64, 8);
    g.fillStyle(0x9aa8b8, 1);
    g.fillRect(0, 0, 64, 2);
    g.fillStyle(0x39424f, 1);
    g.fillRect(31, 8, 2, 24);
    g.fillStyle(0x2e3644, 1);
    g.fillCircle(8, 18, 2);
    g.fillCircle(56, 18, 2);
    g.generateTexture("metal", 64, 32);
    g.destroy();

    // Rustclaw, the Tide Titan: original armored crab-robot boss
    g = scene.make.graphics({ add: false });
    g.lineStyle(6, 0x3a4250, 1);
    for (i = 0; i < 3; i++) {
      g.beginPath(); g.moveTo(56 - i * 10, 80); g.lineTo(36 - i * 12, 96); g.lineTo(30 - i * 12, 110); g.strokePath();
      g.beginPath(); g.moveTo(112 + i * 10, 80); g.lineTo(132 + i * 12, 96); g.lineTo(138 + i * 12, 110); g.strokePath();
    }
    g.fillStyle(0x59626f, 1);
    g.fillRect(26, 56, 26, 10);
    g.fillRect(116, 56, 26, 10);
    g.fillStyle(0x8a3b2a, 1);
    g.fillCircle(16, 52, 16);
    g.fillCircle(152, 52, 16);
    g.fillStyle(0xc4583c, 1);
    g.fillCircle(14, 49, 13);
    g.fillCircle(150, 49, 13);
    g.fillStyle(0xf09a6e, 1);
    g.fillCircle(10, 44, 4);
    g.fillCircle(146, 44, 4);
    g.fillStyle(0x1b1d26, 1);
    g.fillTriangle(0, 40, 16, 52, 0, 56);
    g.fillTriangle(168, 40, 152, 52, 168, 56);
    g.fillStyle(0x6e2f22, 1);
    g.fillEllipse(84, 66, 120, 64);
    g.fillStyle(0xa8452f, 1);
    g.fillEllipse(82, 62, 114, 56);
    g.fillStyle(0xcf6a45, 1);
    g.fillEllipse(76, 54, 86, 34);
    g.fillStyle(0xf09a6e, 1);
    g.fillEllipse(68, 46, 40, 12);
    g.fillStyle(0x59626f, 1);
    g.fillRect(34, 70, 100, 10);
    g.fillStyle(0x8a95a3, 1);
    g.fillRect(34, 70, 100, 3);
    g.fillStyle(0xd8dee6, 1);
    for (i = 0; i < 6; i++) {
      g.fillCircle(42 + i * 17, 76, 2);
    }
    g.fillStyle(0x2e3644, 1);
    g.fillCircle(84, 60, 10);
    g.fillStyle(0x4a5566, 1);
    g.fillCircle(83, 59, 8);
    g.fillStyle(0x59626f, 1);
    g.fillRect(66, 14, 5, 22);
    g.fillRect(97, 14, 5, 22);
    g.fillStyle(0xfff1a8, 1);
    g.fillCircle(68, 12, 8);
    g.fillCircle(100, 12, 8);
    g.fillStyle(0xff5a2a, 1);
    g.fillCircle(69, 13, 4);
    g.fillCircle(101, 13, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(66.5, 10, 1.8);
    g.fillCircle(98.5, 10, 1.8);
    g.lineStyle(3, 0x2e3644, 1);
    g.beginPath(); g.moveTo(60, 2); g.lineTo(74, 6); g.strokePath();
    g.beginPath(); g.moveTo(108, 2); g.lineTo(94, 6); g.strokePath();
    g.generateTexture("boss", 168, 112);
    g.destroy();

    // Boss weak-spot glow (shown when the shell opens)
    g = scene.make.graphics({ add: false });
    for (i = 6; i >= 1; i--) {
      g.fillStyle(0xff5ad1, 0.16);
      g.fillCircle(24, 24, i * 4);
    }
    g.fillStyle(0xffd1f2, 1);
    g.fillCircle(24, 24, 6);
    g.generateTexture("boss-core", 48, 48);
    g.destroy();

    // Boss shockwave wedge
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xffb347, 1);
    g.fillTriangle(0, 14, 12, 0, 24, 14);
    g.fillStyle(0xfff1a8, 1);
    g.fillTriangle(6, 14, 12, 4, 18, 14);
    g.generateTexture("rivet", 24, 14);
    g.destroy();
  }

  // ---------- Helpers for Levels 4-10 ----------
  function addGround(scene, x, width, texture) {
    return addPlatform(scene, x, GROUND_TOP, width, 32, texture);
  }

  function addFlag(scene, x, topY) {
    scene.flag = scene.physics.add.staticSprite(x, topY - 58, "flag");
    scene.flag.refreshBody();
    return scene.flag;
  }

  function addCoins(scene, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      addCoin(scene, list[i][0], list[i][1]);
    }
  }

  // Sand platform that shakes, then falls shortly after you stand on it, and comes back later
  function addCrumble(scene, x, y, width) {
    var plat = scene.add.tileSprite(x + width / 2, y + 10, width, 20, "crumble");
    scene.physics.add.existing(plat, true);
    plat.body.updateFromGameObject();
    plat.isCrumble = true;
    plat.crumbling = false;
    plat.homeX = plat.x;
    plat.homeY = plat.y;
    scene.platforms.add(plat);
    return plat;
  }

  // Slippery ice platform
  function addIce(scene, x, y, width, height) {
    var plat = addPlatform(scene, x, y, width, height, "ice");
    plat.isIce = true;
    return plat;
  }

  // Walking enemy with its own speed (crab, Frostwaddle, snowball). Stomp from above to beat it.
  function addWalker(scene, x, y, texture, speed, bw, bh, ox, oy) {
    var enemy = scene.enemies.create(x, y, texture);
    enemy.walkSpeed = speed;
    enemy.setVelocityX(speed);
    enemy.setCollideWorldBounds(true);
    enemy.body.setSize(bw, bh);
    enemy.body.setOffset(ox, oy);
    enemy.setBounce(0);
    enemy.setMaxVelocity(speed, 800);
    return enemy;
  }

  // Flying enemy on a sine path (Swoopet bird or Duskflit bat)
  function addFlyer(scene, x, y, texture, rangeX, ampY, speed) {
    var f = scene.flyers.create(x, y, texture);
    f.body.moves = false;
    f.body.setSize(28, 16);
    f.body.setOffset(6, 5);
    f.baseX = x;
    f.baseY = y;
    f.rangeX = rangeX;
    f.ampY = ampY;
    f.flySpeed = speed;
    f.phase = (x % 97) / 15;
    f.setDepth(7);
    return f;
  }

  // Rope swing: a seat that swings like a pendulum; ride it and jump off
  function addSwing(scene, ax, ay, len, amp, period) {
    var plat = scene.add.tileSprite(ax, ay + len, 72, 14, "swing");
    scene.physics.add.existing(plat);
    scene.movingPlatforms.add(plat);
    plat.isSwing = true;
    plat.body.setSize(72, 14);
    plat.setDepth(5);
    scene.swings.push({ plat: plat, ax: ax, ay: ay, len: len, amp: amp, period: period });
    return plat;
  }

  // Platform that rises and sinks
  function addLift(scene, x, minY, maxY, width, speed) {
    var plat = scene.add.tileSprite(x, maxY, width, 16, "mover");
    scene.physics.add.existing(plat);
    scene.movingPlatforms.add(plat);
    plat.axis = "y";
    plat.minY = minY;
    plat.maxY = maxY;
    plat.moveSpeed = Math.abs(speed);
    plat.body.setSize(width, 16);
    plat.body.setVelocityY(-Math.abs(speed));
    return plat;
  }

  function addCannon(scene, x, y, dir) {
    scene.add.image(x, y, "cannon").setFlipX(dir > 0).setDepth(5);
    scene.cannons.push({ x: x + dir * 26, y: y - 2, dir: dir });
  }

  // Fireball that leaps out of the lava and drops back in
  function addFireball(scene, x, lavaTop, jump, period, phase) {
    var f = scene.hazards.create(x, lavaTop + 24, "fireball");
    f.body.moves = false;
    f.body.setCircle(8, 3, 3);
    f.isFire = true;
    f.baseY = lavaTop + 24;
    f.jump = jump;
    f.period = period;
    f.phase = phase || 0;
    f.setDepth(7);
    return f;
  }

  function addLava(scene, x, width) {
    scene.add.tileSprite(x + width / 2, 430, width, 40, "lava").setDepth(7);
    scene.lavaZones.push({ x: x, width: width });
  }

  // Water area: the player turns into the shark inside it, and back into the kid outside
  function addWaterZone(scene, x, y, width, height) {
    scene.waterZones.push({ x: x, y: y, width: width, height: height });
    scene.add.rectangle(x, y, width, height, 0x2a90c8, 0.36).setOrigin(0, 0).setDepth(11);
    scene.add.rectangle(x, y, width, 4, 0xbfeaff, 0.75).setOrigin(0, 0).setDepth(11);
  }

  // Wind gust zone that pushes the player sideways
  function addWind(scene, x, width, push) {
    scene.windZones.push({ x: x, y: 0, width: width, height: WORLD_HEIGHT, push: push });
    var i;
    for (i = 0; i < 7; i++) {
      var streak = scene.add.image(x, 70 + i * 48, "windline").setDepth(4).setAlpha(0.55);
      if (push < 0) {
        streak.setFlipX(true);
      }
      scene.tweens.add({
        targets: streak,
        x: { from: push > 0 ? x : x + width, to: push > 0 ? x + width : x },
        duration: 1500 + i * 140,
        delay: i * 210,
        repeat: -1
      });
    }
  }

  // Glowing crystal: lights up the dark cave around it
  function addCrystal(scene, x, groundTop) {
    scene.add.image(x, groundTop, "crystal").setOrigin(0.5, 1).setDepth(16);
    var glow = scene.add.image(x, groundTop - 20, "glow").setDepth(16).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.9);
    scene.tweens.add({
      targets: glow,
      alpha: 0.55,
      scale: 0.9,
      duration: 1300 + (x % 5) * 90,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }

  function addLevelBackdrop(scene, level) {
    var i;
    var cam = scene.cameras.main;
    var cloudSpots = [180, 520, 900, 1300, 1750, 2200, 2650, 3100, 3500, 3900];
    if (level === 4 || level === 5) {
      cam.setBackgroundColor(level === 4 ? 0x8fd8ee : 0xf2b179);
      scene.add.circle(level === 4 ? 640 : 560, level === 4 ? 70 : 150, level === 4 ? 34 : 46, level === 4 ? 0xfff1a8 : 0xffd27a).setScrollFactor(0);
      scene.add.rectangle(0, 285, 12000, 170, level === 4 ? 0x2f8fc0 : 0x2b6f9a, 1).setOrigin(0, 0).setScrollFactor(0.1);
      scene.add.rectangle(0, 285, 12000, 4, 0xd8f4ff, 0.8).setOrigin(0, 0).setScrollFactor(0.1);
      for (i = 0; i < cloudSpots.length; i++) {
        var c = scene.add.image(cloudSpots[i], 40 + (i % 3) * 26, "cloud").setScrollFactor(0.15).setAlpha(0.95);
        if (level === 5) {
          c.setTint(0xffd0c0);
        }
      }
    } else if (level === 6) {
      cam.setBackgroundColor(0xa9dcf5);
      for (i = 0; i < 10; i++) {
        scene.add.image(200 + i * 420, 330, "hills").setScale(1.6).setScrollFactor(0.2).setTint(0x8a9bb0).setAlpha(0.9);
      }
      for (i = 0; i < cloudSpots.length; i++) {
        scene.add.image(cloudSpots[i], 40 + (i % 3) * 40, "cloud").setScrollFactor(0.15);
        scene.add.image(cloudSpots[i] + 200, 200 + (i % 2) * 30, "cloud").setScrollFactor(0.3).setAlpha(0.7);
      }
    } else if (level === 7) {
      cam.setBackgroundColor(0x15121f);
      for (i = 0; i < 10; i++) {
        scene.add.image(200 + i * 420, 50, "hills").setFlipY(true).setScrollFactor(0.2).setTint(0x2a2238);
        scene.add.image(380 + i * 420, 360, "hills").setScrollFactor(0.25).setTint(0x221c2e);
      }
    } else if (level === 8) {
      cam.setBackgroundColor(0xcfe6f5);
      for (i = 0; i < 10; i++) {
        scene.add.image(200 + i * 420, 330, "hills").setScrollFactor(0.25).setTint(0xf4f9fc);
      }
      for (i = 0; i < 36; i++) {
        var flake = scene.add.image(Math.random() * GAME_WIDTH, Math.random() * WORLD_HEIGHT, "snowflake")
          .setScrollFactor(0).setDepth(4).setAlpha(0.5 + Math.random() * 0.5);
        scene.tweens.add({
          targets: flake,
          y: WORLD_HEIGHT + 10,
          duration: 4000 + Math.random() * 4000,
          repeat: -1,
          onRepeat: function (tween, target) {
            target.y = -10;
          }
        });
      }
    } else if (level === 9) {
      cam.setBackgroundColor(0x3a1414);
      for (i = 0; i < 10; i++) {
        scene.add.image(200 + i * 420, 330, "hills").setScale(1.4).setScrollFactor(0.25).setTint(0x4a1f1a);
      }
      scene.add.rectangle(0, 380, 12000, 70, 0xff5a1f, 0.18).setOrigin(0, 0).setScrollFactor(0.1);
    } else {
      cam.setBackgroundColor(0x2b2346);
      for (i = 0; i < 10; i++) {
        scene.add.image(200 + i * 420, 330, "hills").setScrollFactor(0.25).setTint(0x3a3258);
      }
      for (i = 0; i < cloudSpots.length; i++) {
        scene.add.image(cloudSpots[i], 50 + (i % 3) * 26, "cloud").setScrollFactor(0.15).setTint(0x6c6390).setAlpha(0.8);
      }
    }
  }

  // ---------- Level 4: Beach (crumbling sand, crabs, tide pool) ----------
  function buildLevel4(scene) {
    scene.waterZones = [];
    addGround(scene, 0, 700, "sand");
    addWalker(scene, 480, GROUND_TOP - 16, "crab", 95, 30, 18, 5, 9);
    addSpring(scene, 640, GROUND_TOP - 12);
    addGround(scene, 830, 380, "sand");
    addWalker(scene, 1050, GROUND_TOP - 16, "crab", 105, 30, 18, 5, 9);
    addCrumble(scene, 1250, 360, 96);
    addCrumble(scene, 1400, 330, 96);
    addCrumble(scene, 1545, 360, 96);
    addGround(scene, 1640, 960, "sand");
    addWalker(scene, 1760, GROUND_TOP - 16, "crab", 110, 30, 18, 5, 9);
    // Tide pool: kid -> shark inside, shark -> kid on the far rock
    addWaterZone(scene, 1900, 250, 560, WORLD_HEIGHT - 250);
    addSeaweed(scene, 1990, GROUND_TOP);
    addSeaweed(scene, 2320, GROUND_TOP);
    addJelly(scene, 2180, 372, 60);
    addBubblePlatform(scene, 2060, 330);
    addPlatform(scene, 2460, 330, 140, GROUND_TOP + 32 - 330, "rock");
    addGround(scene, 2600, 500, "sand");
    addWalker(scene, 2820, GROUND_TOP - 16, "crab", 115, 30, 18, 5, 9);
    addMovingPlatform(scene, 2900, 300, 96, 2860, 3020, 40);
    var stairs = addStaircase(scene, 3100, 5, 56, 28, 360);
    addFlag(scene, stairs.landingX + stairs.landingW - 80, stairs.landingTop);
    scene.worldWidth = stairs.landingX + stairs.landingW + 80;
    addCoins(scene, [
      [260, 380], [640, 180], [760, 300], [1000, 380], [1298, 320], [1448, 290], [1593, 320],
      [1990, 380], [2060, 270], [2250, 300], [2530, 290], [2900, 260], [3160, 330], [3270, 270],
      [stairs.landingX + 140, stairs.landingTop - 40]
    ]);
  }

  // ---------- Level 5: Pirate ships (rope swings, cannons, sea between ships) ----------
  function buildLevel5(scene) {
    scene.waterZones = [];
    addGround(scene, 0, 520, "deck");
    addSpring(scene, 450, GROUND_TOP - 12);
    addPlatform(scene, 520, 320, 980, GROUND_TOP + 32 - 320, "hull");
    addPlatform(scene, 520, 300, 980, 20, "deck");
    scene.add.image(1010, 300, "mast").setOrigin(0.5, 1).setDepth(1);
    addBramble(scene, 820, 280);
    addWalker(scene, 1180, 284, "crab", 100, 30, 18, 5, 9);
    addCannon(scene, 1460, 284, -1);
    // Sea between the ships (shark form), with two rope swings above it
    addGround(scene, 1500, 800, "sand");
    // Sea surface sits below the decks and the swing seats, so riders stay the kid
    addWaterZone(scene, 1500, 330, 800, WORLD_HEIGHT - 330);
    addPlatform(scene, 2200, 360, 60, GROUND_TOP + 32 - 360, "rock");
    addSeaweed(scene, 1620, GROUND_TOP);
    addSeaweed(scene, 2180, GROUND_TOP);
    addJelly(scene, 1900, 380, 50);
    addSwing(scene, 1800, 40, 260, 0.9, 3400);
    addSwing(scene, 2130, 40, 230, 0.8, 3000);
    addPlatform(scene, 2300, 320, 1000, GROUND_TOP + 32 - 320, "hull");
    addPlatform(scene, 2300, 300, 1000, 20, "deck");
    scene.add.image(2800, 300, "mast").setOrigin(0.5, 1).setDepth(1);
    addWalker(scene, 2560, 284, "crab", 110, 30, 18, 5, 9);
    addBramble(scene, 3000, 280);
    addMovingPlatform(scene, 2800, 190, 96, 2700, 2950, 45);
    addCannon(scene, 3260, 284, -1);
    addGround(scene, 3300, 600, "deck");
    addFlag(scene, 3800, GROUND_TOP);
    scene.worldWidth = 3900;
    addCoins(scene, [
      [200, 380], [450, 200], [700, 260], [1000, 200], [1300, 260], [1620, 380], [1800, 240],
      [2000, 380], [2130, 230], [2500, 260], [2800, 150], [3100, 260], [3500, 380], [3700, 380]
    ]);
  }

  // ---------- Level 6: Sky peaks (wind gusts, Swoopet birds) ----------
  function buildLevel6(scene) {
    scene.waterZones = [];
    addGround(scene, 0, 600, "cliff");
    addBramble(scene, 420, GROUND_TOP - 20);
    addWind(scene, 600, 720, 70);
    addPlatform(scene, 640, 340, 110, 24, "cloudplat");
    addPlatform(scene, 830, 300, 110, 24, "cloudplat");
    addPlatform(scene, 1020, 340, 110, 24, "cloudplat");
    addPlatform(scene, 1210, 320, 110, 24, "cloudplat");
    addGround(scene, 1320, 700, "cliff");
    addWind(scene, 1320, 700, -60);
    addBramble(scene, 1700, GROUND_TOP - 20);
    addFlyer(scene, 1550, 300, "bird", 120, 40, 1.4);
    addFlyer(scene, 1850, 250, "bird", 140, 50, 1.1);
    addSpring(scene, 1960, GROUND_TOP - 12);
    addPlatform(scene, 2020, 220, 360, GROUND_TOP + 32 - 220, "cliff");
    addMovingPlatform(scene, 2500, 250, 104, 2460, 2800, 55);
    addFlyer(scene, 2650, 160, "bird", 120, 40, 1.6);
    addGround(scene, 2900, 350, "cliff");
    addBramble(scene, 3100, GROUND_TOP - 20);
    var stairs = addStaircase(scene, 3250, 4, 56, 28, 360);
    addFlag(scene, stairs.landingX + stairs.landingW - 80, stairs.landingTop);
    scene.worldWidth = stairs.landingX + stairs.landingW + 80;
    addCoins(scene, [
      [260, 380], [695, 300], [885, 260], [1075, 300], [1265, 280], [1500, 380], [1800, 380],
      [1990, 200], [2200, 180], [2500, 200], [2700, 200], [3000, 380], [3300, 330],
      [stairs.landingX + 140, stairs.landingTop - 40]
    ]);
  }

  // ---------- Level 7: Crystal cave (darkness, glowing crystals, underground pool) ----------
  function buildLevel7(scene) {
    scene.waterZones = [];
    scene.darkLevel = true;
    addGround(scene, 0, 900, "cavefloor");
    addCrystal(scene, 300, GROUND_TOP);
    addBramble(scene, 560, GROUND_TOP - 20);
    addCrystal(scene, 820, GROUND_TOP);
    addGround(scene, 1020, 520, "cavefloor");
    addPlatform(scene, 1180, 300, 120, 20, "cavefloor");
    addCrystal(scene, 1240, 300);
    addWalker(scene, 1400, GROUND_TOP - 16, "crab", 95, 30, 18, 5, 9);
    addGround(scene, 1540, 880, "cavefloor");
    addWaterZone(scene, 1640, 230, 660, WORLD_HEIGHT - 230);
    addJelly(scene, 1900, 372, 60);
    addBubblePlatform(scene, 1800, 300);
    addBubblePlatform(scene, 2060, 280);
    addCrystal(scene, 1980, GROUND_TOP);
    addPlatform(scene, 2300, 330, 120, GROUND_TOP + 32 - 330, "rock");
    addGround(scene, 2420, 480, "cavefloor");
    addWalker(scene, 2620, GROUND_TOP - 16, "crab", 105, 30, 18, 5, 9);
    addCrystal(scene, 2700, GROUND_TOP);
    addCrumble(scene, 2935, 360, 80);
    addCrumble(scene, 3050, 340, 80);
    addGround(scene, 3160, 640, "cavefloor");
    addFlyer(scene, 3400, 300, "bat", 110, 40, 1.5);
    addCrystal(scene, 3550, GROUND_TOP);
    addFlag(scene, 3700, GROUND_TOP);
    scene.worldWidth = 3800;
    addCoins(scene, [
      [200, 380], [450, 380], [960, 300], [1240, 260], [1460, 380], [1800, 240], [2060, 220],
      [2200, 380], [2360, 290], [2550, 380], [2975, 320], [3090, 300], [3300, 380], [3600, 380]
    ]);
  }

  // ---------- Level 8: Frost fields (slippery ice, Frostwaddles, rolling snowballs) ----------
  function buildLevel8(scene) {
    scene.waterZones = [];
    addGround(scene, 0, 600, "snow");
    addWalker(scene, 420, GROUND_TOP - 18, "waddler", 60, 22, 28, 5, 5);
    addIce(scene, 600, GROUND_TOP, 600, 32);
    addWalker(scene, 900, GROUND_TOP - 18, "waddler", 70, 22, 28, 5, 5);
    var ball = addWalker(scene, 1100, GROUND_TOP - 16, "snowball", 120, 26, 26, 2, 2);
    ball.rolls = true;
    addIce(scene, 1320, 340, 140, 24);
    addIce(scene, 1540, 300, 140, 24);
    addIce(scene, 1760, 340, 140, 24);
    addGround(scene, 1980, 620, "snow");
    addBramble(scene, 2200, GROUND_TOP - 20);
    addSpring(scene, 2450, GROUND_TOP - 12);
    addMovingPlatform(scene, 2700, 300, 104, 2660, 2900, 50);
    addIce(scene, 3000, GROUND_TOP, 300, 32);
    var ball2 = addWalker(scene, 3150, GROUND_TOP - 16, "snowball", 130, 26, 26, 2, 2);
    ball2.rolls = true;
    var stairs = addStaircase(scene, 3300, 4, 56, 28, 360);
    addFlag(scene, stairs.landingX + stairs.landingW - 80, stairs.landingTop);
    scene.worldWidth = stairs.landingX + stairs.landingW + 80;
    addCoins(scene, [
      [250, 380], [700, 380], [1000, 330], [1390, 300], [1610, 260], [1830, 300], [2100, 380],
      [2450, 200], [2700, 250], [2850, 250], [3100, 380], [3350, 330],
      [stairs.landingX + 140, stairs.landingTop - 40]
    ]);
  }

  // ---------- Level 9: Volcano (lava, rising/sinking platforms, fireballs) ----------
  function buildLevel9(scene) {
    scene.waterZones = [];
    addGround(scene, 0, 600, "basalt");
    addLava(scene, 600, 500);
    addLift(scene, 690, 280, 380, 96, 50);
    addLift(scene, 850, 240, 360, 96, 60);
    addLift(scene, 1010, 270, 370, 96, 45);
    addFireball(scene, 770, 412, 200, 2600, 0);
    addFireball(scene, 930, 412, 230, 3000, 1.3);
    addGround(scene, 1100, 500, "basalt");
    addBramble(scene, 1300, GROUND_TOP - 20);
    addWalker(scene, 1450, GROUND_TOP - 16, "crab", 110, 30, 18, 5, 9);
    addLava(scene, 1600, 700);
    addMovingPlatform(scene, 1760, 330, 104, 1700, 1950, 60);
    addLift(scene, 2140, 260, 370, 96, 55);
    addFireball(scene, 1880, 412, 220, 2800, 0.6);
    addFireball(scene, 2240, 412, 200, 2400, 2.0);
    addGround(scene, 2300, 500, "basalt");
    addBramble(scene, 2550, GROUND_TOP - 20);
    addLava(scene, 2800, 400);
    addCrumble(scene, 2840, 360, 90);
    addCrumble(scene, 2975, 340, 90);
    addCrumble(scene, 3105, 360, 90);
    addFireball(scene, 3030, 412, 210, 2700, 1.0);
    addGround(scene, 3200, 350, "basalt");
    addFlyer(scene, 3450, 300, "bat", 120, 40, 1.6);
    var stairs = addStaircase(scene, 3550, 4, 56, 28, 360);
    addFlag(scene, stairs.landingX + stairs.landingW - 80, stairs.landingTop);
    scene.worldWidth = stairs.landingX + stairs.landingW + 80;
    addCoins(scene, [
      [250, 380], [690, 230], [850, 190], [1010, 220], [1250, 380], [1760, 280], [2140, 210],
      [2450, 380], [2885, 320], [3020, 300], [3150, 320], [3400, 380],
      [stairs.landingX + 140, stairs.landingTop - 40]
    ]);
  }

  // ---------- Level 10: Boss arena (Rustclaw, the Tide Titan) ----------
  function buildLevel10(scene) {
    scene.waterZones = [];
    scene.worldWidth = 1600;
    addGround(scene, 0, 1600, "metal");
    addPlatform(scene, 170, 290, 150, 20, "metal");
    addPlatform(scene, 1280, 290, 150, 20, "metal");
    addSpring(scene, 800, GROUND_TOP - 12);
    addCoins(scene, [[245, 250], [1355, 250], [800, 200], [520, 380], [1080, 380]]);
    // No flag here: beating the boss wins the game. A hidden, unreachable flag keeps the goal check simple.
    scene.flag = scene.physics.add.staticSprite(-400, -400, "flag");
    scene.flag.setVisible(false);
    scene.flag.refreshBody();
    scene.bossSpec = { x: 1250 };
  }

  class MainScene extends Phaser.Scene {
    constructor() {
      super("main");
    }

    init(data) {
      this.level = readStartLevel(data);
      this.form = null;
      this.underwater = false;
      this.waterZones = [];
    }

    create() {
      this.won = false;
      this.completing = false;
      this.advanceLevel = 0;
      this.coinCount = 0;
      this.restarting = false;
      this.sharkFins = false;
      this.finTime = 0;
      this.iceUntil = 0;
      this.squash = 0;
      this.artSX = 1;
      this.artSY = 1;
      this.artAngle = 0;
      this.artWasGround = true;
      this.artPrevVy = 0;
      this.boss = null;
      this.bossCore = null;
      this.bossBar = null;
      this.ropeGfx = null;
      this.darkness = null;
      this.lives = START_LIVES;
      this.invulnUntil = 0;
      this.touchLeft = false;
      this.touchRight = false;
      this.touchJump = false;
      this.touchControlsOn = false;

      makeTextures(this);
      makeWorldTextures(this);

      this.physics.world.checkCollision.down = false;
      this.physics.world.gravity.y = 980;

      if (this.level === 3) {
        this.add.tileSprite(0, 0, 8000, 450, "water-grad").setOrigin(0, 0).setScrollFactor(0.08).setDepth(0);
        this.cameras.main.setBackgroundColor(0x1a5878);
      } else if (this.level >= 4) {
        addLevelBackdrop(this, this.level);
      } else {
        this.cameras.main.setBackgroundColor(0x87c5d6);
        var i;
        for (i = 0; i < 10; i++) {
          this.add.image(200 + i * 420, 330, "hills").setScrollFactor(0.25).setAlpha(0.85);
        }
        var cloudSpots = [180, 520, 900, 1300, 1750, 2200, 2650, 3100, 3500];
        for (i = 0; i < cloudSpots.length; i++) {
          this.add.image(cloudSpots[i], 40 + (i % 3) * 28, "cloud").setScrollFactor(0.15).setAlpha(0.95);
        }
      }

      this.platforms = this.add.group();
      this.coins = this.physics.add.staticGroup();
      this.springs = this.physics.add.staticGroup();
      this.enemies = this.physics.add.group();
      this.bubblePlatforms = this.physics.add.group();
      this.jellies = this.physics.add.group();
      // Group defaults are applied when a platform is added, so set them here (no gravity, immovable,
      // and friction so a rider is carried along).
      this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true, frictionX: 1 });
      this.hazards = this.physics.add.group({ allowGravity: false });
      this.flyers = this.physics.add.group({ allowGravity: false, immovable: true });
      this.windZones = [];
      this.lavaZones = [];
      this.cannons = [];
      this.swings = [];
      this.darkLevel = false;
      this.bossSpec = null;

      var builders = [null, buildLevel1, buildLevel2, buildLevel3, buildLevel4, buildLevel5,
        buildLevel6, buildLevel7, buildLevel8, buildLevel9, buildLevel10];
      (builders[this.level] || buildLevel1)(this);

      this.physics.world.setBounds(0, 0, this.worldWidth, WORLD_HEIGHT);
      this.cameras.main.setBounds(0, 0, this.worldWidth, WORLD_HEIGHT);

      this.player = this.physics.add.sprite(PLAYER_START_X, PLAYER_START_Y, "kid");
      this.player.setCollideWorldBounds(true);
      this.player.setDepth(10);
      // The physics sprite stays invisible; a separate art image follows it so tilt and
      // squash/stretch never change the hitbox.
      this.player.setVisible(false);
      this.playerShadow = this.add.image(this.player.x, GROUND_TOP, "player-shadow").setDepth(9).setVisible(false);
      this.playerArt = this.add.image(this.player.x, this.player.y, "kid").setOrigin(0.5, 1).setDepth(10);
      this.dorsalFin = this.add.image(this.player.x, this.player.y, "shark-dorsal").setOrigin(0.5, 1).setDepth(11).setVisible(false);
      this.tailFin = this.add.image(this.player.x, this.player.y, "shark-tail").setOrigin(1, 0.5).setDepth(9).setVisible(false);
      this.sharkFins = false;
      var startShark = this.isInWater(this.player.x, this.player.y);
      if (startShark) {
        this.player.body.setSize(36, 22);
        this.player.body.setOffset(14, 10);
      } else {
        this.player.body.setSize(22, 36);
        this.player.body.setOffset(5, 10);
      }
      this.setForm(startShark ? "shark" : "kid", true);

      this.physics.add.collider(this.player, this.platforms, this.onPlatformCollide, null, this);
      this.physics.add.collider(this.enemies, this.platforms);
      this.physics.add.collider(this.player, this.movingPlatforms);
      this.physics.add.collider(this.player, this.bubblePlatforms, null, this.passFromBelow, this);
      this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
      this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
      this.physics.add.overlap(this.player, this.flyers, this.hitEnemy, null, this);
      this.physics.add.overlap(this.player, this.hazards, this.hitHazard, null, this);
      this.physics.add.overlap(this.player, this.springs, this.hitSpring, null, this);
      this.physics.add.overlap(this.player, this.jellies, this.hitJelly, null, this);
      this.physics.add.overlap(this.player, this.flag, this.reachGoal, null, this);

      if (this.swings.length) {
        this.ropeGfx = this.add.graphics().setDepth(4);
      }
      if (this.cannons.length) {
        this.time.addEvent({ delay: 2200, loop: true, callback: this.fireCannons, callbackScope: this });
      }
      if (this.darkLevel) {
        this.darkness = this.add.image(this.player.x, this.player.y, "darkness").setDepth(15);
      }

      this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
      this.cameras.main.setDeadzone(80, 40);

      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
      this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.input.addPointer(2);
      this.addTouchControls();

      this.add.text(16, 10, "Mako's World", {
        fontFamily: "sans-serif",
        fontSize: "20px",
        color: "#ffffff",
        stroke: "#1a1a22",
        strokeThickness: 5
      }).setScrollFactor(0).setDepth(20);

      var levelLabel;
      if (this.level === 3) {
        levelLabel = "Level 3  ·  Underwater";
      } else if (LEVEL_NAMES[this.level]) {
        levelLabel = "Level " + this.level + "  ·  " + LEVEL_NAMES[this.level];
      } else {
        levelLabel = "Level " + this.level;
      }
      this.levelText = this.add.text(16, 36, levelLabel, {
        fontFamily: "sans-serif",
        fontSize: "14px",
        color: "#ffffff",
        stroke: "#1a1a22",
        strokeThickness: 3
      }).setScrollFactor(0).setDepth(20);

      this.coinText = this.add.text(16, 56, "Coins: 0", {
        fontFamily: "sans-serif",
        fontSize: "16px",
        color: "#ffffff",
        stroke: "#1a1a22",
        strokeThickness: 4
      }).setScrollFactor(0).setDepth(20);

      this.livesText = this.add.text(16, 76, "Lives: " + this.lives, {
        fontFamily: "sans-serif",
        fontSize: "16px",
        color: "#ffe566",
        stroke: "#1a1a22",
        strokeThickness: 4
      }).setScrollFactor(0).setDepth(20);

      this.add.text(GAME_WIDTH - 16, 12, "Move: Arrows or A/D    Jump: Space, Up, or W    Restart: R", {
        fontFamily: "sans-serif",
        fontSize: "13px",
        color: "#ffffff",
        stroke: "#1a1a22",
        strokeThickness: 3
      }).setOrigin(1, 0).setScrollFactor(0).setDepth(20);

      if (this.bossSpec) {
        this.spawnBoss(this.bossSpec);
      }

      this.winShade = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.45)
        .setScrollFactor(0).setDepth(30).setVisible(false);
      this.bannerText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 16, "", {
        fontFamily: "sans-serif",
        fontSize: "52px",
        color: "#ffe566",
        stroke: "#1a1a22",
        strokeThickness: 8
      }).setOrigin(0.5).setScrollFactor(0).setDepth(31).setVisible(false);
      this.bannerHint = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, "", {
        fontFamily: "sans-serif",
        fontSize: "18px",
        color: "#ffffff",
        stroke: "#1a1a22",
        strokeThickness: 4
      }).setOrigin(0.5).setScrollFactor(0).setDepth(31).setVisible(false);

      this.input.on("pointerdown", function () {
        if (this.won) {
          this.scene.restart({ level: 1 });
        } else if (this.completing) {
          this.goToAdvance();
        }
      }, this);
    }


    wantsTouchControls() {
      var coarse = false;
      var fine = false;
      try {
        coarse = !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
        fine = !!(window.matchMedia && window.matchMedia("(pointer: fine)").matches);
      } catch (err) {
        // ignore
      }
      var touch = !!(this.sys.game.device && this.sys.game.device.input && this.sys.game.device.input.touch);
      return coarse || (touch && !fine);
    }

    addTouchControls() {
      this.touchLeft = false;
      this.touchRight = false;
      this.touchJump = false;
      this.touchControlsOn = this.wantsTouchControls();
      if (typeof window.applyMakoLayout === "function") {
        window.applyMakoLayout();
        this.touchControlsOn = this.wantsTouchControls() || (document.getElementById("app") && document.getElementById("app").classList.contains("touch-play"));
      }
    }

    updateLivesHud() {
      if (this.livesText) {
        this.livesText.setText("Lives: " + this.lives);
      }
    }

    startInvulnFlash() {
      var targets = [this.playerArt, this.dorsalFin, this.tailFin].filter(Boolean);
      if (!targets.length) {
        return;
      }
      this.tweens.killTweensOf(targets);
      var scene = this;
      this.tweens.add({
        targets: targets,
        alpha: 0.22,
        duration: 90,
        yoyo: true,
        repeat: 10,
        onComplete: function () {
          var i;
          for (i = 0; i < targets.length; i++) {
            if (targets[i] && targets[i].active) {
              targets[i].setAlpha(1);
            }
          }
        }
      });
    }

    respawnPlayer() {
      if (!this.player || !this.player.body) {
        return;
      }
      this.player.setVelocity(0, 0);
      this.player.setAcceleration(0, 0);
      this.player.setFlipX(false);
      this.player.setPosition(PLAYER_START_X, PLAYER_START_Y);
      this.form = null;
      var startShark = this.isInWater(PLAYER_START_X, PLAYER_START_Y);
      if (startShark) {
        this.player.body.setSize(36, 22);
        this.player.body.setOffset(14, 10);
      } else {
        this.player.body.setSize(22, 36);
        this.player.body.setOffset(5, 10);
      }
      this.setForm(startShark ? "shark" : "kid", true);
      this.player.setVelocity(0, 0);
      this.cameras.main.centerOn(PLAYER_START_X, PLAYER_START_Y);
      this.invulnUntil = this.time.now + INVULN_MS;
      this.startInvulnFlash();
    }

    loseLife() {
      if (this.won || this.completing || this.restarting) {
        return;
      }
      if (this.time.now < this.invulnUntil) {
        return;
      }
      this.lives -= 1;
      this.updateLivesHud();
      if (this.lives <= 0) {
        this.restarting = true;
        if (this.player) {
          this.player.setVelocity(0, 0);
        }
        this.winShade.setVisible(true);
        this.bannerText.setVisible(true);
        this.bannerHint.setVisible(true);
        this.bannerText.setText("Try again");
        this.bannerHint.setText("The level starts over...");
        this.time.delayedCall(1600, function () {
          this.scene.restart({ level: this.level });
        }, [], this);
        return;
      }
      this.respawnPlayer();
    }

    onPlatformCollide(player, plat) {
      if (!plat || !plat.body) {
        return;
      }
      if (player.body.bottom > plat.body.top + 6) {
        return;
      }
      if (plat.isIce) {
        this.iceUntil = this.time.now + 120;
      }
      if (plat.isCrumble && !plat.crumbling) {
        this.startCrumble(plat);
      }
    }

    startCrumble(plat) {
      var scene = this;
      plat.crumbling = true;
      this.tweens.add({ targets: plat, x: plat.homeX + 2, duration: 50, yoyo: true, repeat: 4 });
      this.time.delayedCall(520, function () {
        if (!plat.body) {
          return;
        }
        plat.body.checkCollision.none = true;
        scene.tweens.add({ targets: plat, y: plat.homeY + 70, alpha: 0, duration: 380 });
      });
      this.time.delayedCall(3200, function () {
        if (!plat.body) {
          return;
        }
        scene.tweens.killTweensOf(plat);
        plat.x = plat.homeX;
        plat.y = plat.homeY;
        plat.alpha = 1;
        plat.body.updateFromGameObject();
        plat.body.checkCollision.none = false;
        plat.crumbling = false;
      });
    }

    hitHazard() {
      if (this.won || this.completing || this.restarting) {
        return;
      }
      this.loseLife();
    }

    fireCannons() {
      if (this.won || this.completing || this.restarting || !this.player) {
        return;
      }
      var i;
      for (i = 0; i < this.cannons.length; i++) {
        var c = this.cannons[i];
        if (Math.abs(c.x - this.player.x) > 760) {
          continue;
        }
        var ball = this.hazards.create(c.x, c.y, "cannonball");
        ball.body.setCircle(8, 1, 1);
        ball.setVelocityX(c.dir * 190);
        ball.life = this.time.now + 6000;
        ball.setDepth(7);
      }
    }

    windAt(x, y) {
      var zones = this.windZones || [];
      var i;
      for (i = 0; i < zones.length; i++) {
        var z = zones[i];
        if (x >= z.x && x <= z.x + z.width && y >= z.y && y <= z.y + z.height) {
          return z.push;
        }
      }
      return 0;
    }

    inLava() {
      var p = this.player;
      var zones = this.lavaZones || [];
      var i;
      for (i = 0; i < zones.length; i++) {
        var z = zones[i];
        if (p.x >= z.x && p.x <= z.x + z.width && p.body.bottom > 414) {
          return true;
        }
      }
      return false;
    }

    updateSwings(time) {
      if (!this.swings || !this.swings.length || !this.ropeGfx) {
        return;
      }
      var g = this.ropeGfx;
      g.clear();
      var i;
      for (i = 0; i < this.swings.length; i++) {
        var s = this.swings[i];
        var a = s.amp * Math.sin((time / s.period) * Math.PI * 2);
        var tx = s.ax + s.len * Math.sin(a);
        var ty = s.ay + s.len * Math.cos(a);
        var p = s.plat;
        if (p.body) {
          p.body.setVelocity((tx - p.x) * 60, (ty - p.y) * 60);
        }
        g.lineStyle(3, 0x7a5530, 1);
        g.lineBetween(s.ax, s.ay, p.x - 30, p.y - 6);
        g.lineBetween(s.ax, s.ay, p.x + 30, p.y - 6);
        g.fillStyle(0x4a3424, 1);
        g.fillCircle(s.ax, s.ay, 5);
      }
    }

    updateFlyers(time) {
      if (!this.flyers) {
        return;
      }
      var list = this.flyers.getChildren();
      var t = time / 1000;
      var i;
      for (i = 0; i < list.length; i++) {
        var f = list[i];
        if (!f.active) {
          continue;
        }
        var nx = f.baseX + Math.sin(t * f.flySpeed + f.phase) * f.rangeX;
        f.setFlipX(nx < f.x);
        f.x = nx;
        f.y = f.baseY + Math.sin(t * f.flySpeed * 2.2 + f.phase) * f.ampY;
        f.angle = Math.sin(t * 12 + f.phase) * 6;
      }
    }

    updateHazards(time) {
      if (!this.hazards) {
        return;
      }
      var list = this.hazards.getChildren().slice();
      var i;
      for (i = 0; i < list.length; i++) {
        var h = list[i];
        if (!h.active) {
          continue;
        }
        if (h.isFire) {
          var s = Math.sin((time / h.period) * Math.PI * 2 + h.phase);
          var lift = s > 0 ? s : 0;
          h.y = h.baseY - h.jump * lift;
          h.setVisible(lift > 0.02);
          h.angle += 6;
        } else if (h.life && time > h.life) {
          h.destroy();
        }
      }
    }

    spawnBoss(spec) {
      var b = this.physics.add.sprite(spec.x, GROUND_TOP - 70, "boss");
      b.setDepth(8);
      b.body.setSize(132, 76);
      b.body.setOffset(18, 34);
      b.setCollideWorldBounds(true);
      this.physics.add.collider(b, this.platforms);
      this.boss = b;
      this.bossHp = 5;
      this.bossMaxHp = 5;
      this.bossState = "walk";
      this.bossTimer = this.time.now + 3200;
      this.bossDir = -1;
      this.bossInvuln = 0;
      this.bossSlamAt = 0;
      this.bossCore = this.add.image(b.x, b.y, "boss-core").setDepth(9).setBlendMode(Phaser.BlendModes.ADD).setVisible(false);
      this.physics.add.overlap(this.player, b, this.hitBoss, null, this);
      this.add.text(GAME_WIDTH / 2, 46, "Rustclaw, the Tide Titan", {
        fontFamily: "sans-serif",
        fontSize: "16px",
        color: "#ffd1c2",
        stroke: "#1a1a22",
        strokeThickness: 4
      }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(21);
      this.bossBar = this.add.graphics().setScrollFactor(0).setDepth(21);
      this.drawBossBar();
    }

    drawBossBar() {
      if (!this.bossBar) {
        return;
      }
      var g = this.bossBar;
      var w = 300;
      var x = (GAME_WIDTH - w) / 2;
      var y = 70;
      var frac = Math.max(0, this.bossHp) / this.bossMaxHp;
      g.clear();
      g.fillStyle(0x1a1a22, 0.85);
      g.fillRect(x - 3, y - 3, w + 6, 20);
      g.fillStyle(0x5a2020, 1);
      g.fillRect(x, y, w, 14);
      g.fillStyle(0xff5a3c, 1);
      g.fillRect(x, y, w * frac, 14);
      g.fillStyle(0xffb39e, 1);
      g.fillRect(x, y, w * frac, 4);
    }

    updateBoss(time) {
      var b = this.boss;
      if (!b || !b.active || this.bossState === "down") {
        return;
      }
      if (this.bossCore) {
        this.bossCore.setPosition(b.x, b.y - 4);
      }
      if (this.won || this.restarting) {
        b.setVelocityX(0);
        return;
      }
      var speed = 80 + (this.bossMaxHp - this.bossHp) * 22;
      if (this.bossState === "walk") {
        if (b.x < 150) {
          this.bossDir = 1;
        } else if (b.x > this.worldWidth - 150) {
          this.bossDir = -1;
        }
        b.setVelocityX(this.bossDir * speed);
        b.setFlipX(this.bossDir > 0);
        if (time > this.bossTimer) {
          this.bossState = "slam";
          this.bossSlamAt = time;
          b.setVelocity(0, -430);
        }
      } else if (this.bossState === "slam") {
        b.setVelocityX(0);
        if (time > this.bossSlamAt + 250 && (b.body.blocked.down || b.body.touching.down)) {
          this.spawnShockwaves(b);
          this.cameras.main.shake(220, 0.01);
          this.bossState = "tired";
          this.bossTimer = time + 2400;
          this.bossCore.setVisible(true);
          b.setTint(0xb8c4ff);
        }
      } else if (this.bossState === "tired") {
        b.setVelocityX(0);
        this.bossCore.setAlpha(0.6 + 0.4 * Math.sin(time / 90));
        if (time > this.bossTimer) {
          this.bossWake(time);
        }
      }
    }

    bossWake(time) {
      this.bossState = "walk";
      this.bossTimer = time + 3000;
      this.bossCore.setVisible(false);
      this.boss.clearTint();
      this.bossDir = this.player.x < this.boss.x ? -1 : 1;
    }

    spawnShockwaves(b) {
      var dirs = [-1, 1];
      var i;
      for (i = 0; i < dirs.length; i++) {
        var r = this.hazards.create(b.x + dirs[i] * 70, GROUND_TOP - 7, "rivet");
        r.setVelocityX(dirs[i] * 230);
        r.life = this.time.now + 4000;
        r.setDepth(7);
      }
    }

    hitBoss(player, b) {
      if (this.won || this.completing || this.restarting || this.bossState === "down") {
        return;
      }
      var now = this.time.now;
      if (now < this.bossInvuln) {
        return;
      }
      var fromAbove = player.body.velocity.y > 40 && player.body.bottom <= b.body.top + 24;
      if (fromAbove && this.bossState === "tired") {
        this.bossHp -= 1;
        this.bossInvuln = now + 700;
        player.setVelocityY(-560);
        this.drawBossBar();
        this.tweens.add({
          targets: b,
          alpha: 0.35,
          duration: 80,
          yoyo: true,
          repeat: 3,
          onComplete: function () {
            b.setAlpha(1);
          }
        });
        if (this.bossHp <= 0) {
          this.defeatBoss();
        } else {
          this.bossWake(now);
        }
      } else if (fromAbove) {
        // Armored shell: bounce off without hurting him
        this.bossInvuln = now + 300;
        player.setVelocityY(-460);
      } else {
        this.loseLife();
      }
    }

    defeatBoss() {
      var b = this.boss;
      this.bossState = "down";
      b.setVelocity(0, 0);
      b.body.enable = false;
      this.bossCore.setVisible(false);
      this.drawBossBar();
      this.tweens.add({ targets: b, angle: 18, y: b.y + 30, alpha: 0, duration: 1200 });
      this.hazards.clear(true, true);
      this.showWin();
    }

    showWin() {
      this.won = true;
      this.player.setVelocity(0, 0);
      this.winShade.setVisible(true);
      this.bannerText.setVisible(true);
      this.bannerHint.setVisible(true);
      this.bannerText.setText("You win!");
      this.bannerHint.setText("Press R or click to play again");
    }

    updatePlayerArt(dt) {
      if (!this.player || !this.playerArt || !this.player.body) {
        return;
      }
      var p = this.player;
      var body = p.body;
      var art = this.playerArt;
      var shark = this.form === "shark";
      var onGround = body.blocked.down || body.touching.down;
      var vy = body.velocity.y;
      var vx = body.velocity.x;
      if (onGround && !this.artWasGround && this.artPrevVy > 220) {
        this.squash = 1;
      }
      this.artWasGround = onGround;
      this.artPrevVy = vy;
      this.squash = Math.max(0, this.squash - dt / 180);
      var tsx = 1;
      var tsy = 1;
      if (this.squash > 0) {
        tsx = 1 + 0.2 * this.squash;
        tsy = 1 - 0.18 * this.squash;
      } else if (!onGround && vy < -120) {
        tsx = shark ? 0.96 : 0.92;
        tsy = shark ? 1.05 : 1.1;
      } else if (!onGround && vy > 200) {
        tsx = 0.96;
        tsy = 1.05;
      }
      if (this.squash > 0) {
        this.artSX = tsx;
        this.artSY = tsy;
      } else {
        var k = Math.min(1, dt / 70);
        this.artSX += (tsx - this.artSX) * k;
        this.artSY += (tsy - this.artSY) * k;
      }
      var facing = p.flipX ? -1 : 1;
      var targetAngle;
      if (shark) {
        targetAngle = Phaser.Math.Clamp(vy / 28, -14, 14) * facing;
      } else if (onGround) {
        targetAngle = Math.abs(vx) > 20 ? (vx > 0 ? 6 : -6) : 0;
      } else {
        targetAngle = Phaser.Math.Clamp(vx / 60, -4, 4);
      }
      this.artAngle += (targetAngle - this.artAngle) * Math.min(1, dt / 90);
      art.setTexture(p.texture.key);
      art.setFlipX(p.flipX);
      art.x = p.x;
      art.y = p.y + p.height / 2;
      art.setScale(this.artSX, this.artSY);
      art.setAngle(this.artAngle);

      // Soft drop shadow on the nearest surface below
      var best = null;
      var bottom = body.bottom;
      var lists = [this.platforms.getChildren(), this.movingPlatforms.getChildren()];
      var li;
      var i;
      for (li = 0; li < lists.length; li++) {
        for (i = 0; i < lists[li].length; i++) {
          var b = lists[li][i].body;
          if (!b || !b.enable || b.checkCollision.none) {
            continue;
          }
          if (p.x >= b.left && p.x <= b.right && b.top >= bottom - 6) {
            if (best === null || b.top < best) {
              best = b.top;
            }
          }
        }
      }
      if (best === null) {
        this.playerShadow.setVisible(false);
      } else {
        var s = Phaser.Math.Clamp(1 - (best - bottom) / 280, 0.25, 1);
        this.playerShadow.setVisible(true);
        this.playerShadow.setPosition(p.x, best + 1);
        this.playerShadow.setScale((shark ? 1.05 : 0.7) * s, s);
        this.playerShadow.setAlpha(0.9 * s);
      }
    }

    passFromBelow(player, platform) {
      return player.body.velocity.y >= 0 && player.body.bottom <= platform.body.top + 14;
    }

    collectCoin(player, coin) {
      coin.disableBody(true, true);
      this.coinCount += 1;
      this.coinText.setText("Coins: " + this.coinCount);
    }

    hitSpring(player, spring) {
      if (this.won || this.completing || this.restarting) {
        return;
      }
      if (player.body.center.y <= spring.body.top + 16 && player.body.velocity.y >= -30) {
        player.setVelocityY(this.underwater ? WATER_BOUNCE_VELOCITY : SPRING_VELOCITY);
      }
    }

    hitJelly(player, jelly) {
      if (this.won || this.completing || this.restarting || !jelly.active) {
        return;
      }
      this.loseLife();
    }

    hitEnemy(player, enemy) {
      if (this.won || this.completing || this.restarting || !enemy.active) {
        return;
      }
      var stomping = player.body.velocity.y > 40 && player.body.center.y < enemy.body.center.y;
      if (stomping) {
        enemy.disableBody(true, true);
        player.setVelocityY(-280);
      } else {
        this.loseLife();
      }
    }

    reachGoal() {
      if (this.won || this.completing || this.restarting) {
        return;
      }
      this.player.setVelocity(0, 0);
      this.winShade.setVisible(true);
      this.bannerText.setVisible(true);
      this.bannerHint.setVisible(true);
      if (this.level < MAX_LEVEL) {
        this.completing = true;
        this.advanceLevel = this.level + 1;
        this.bannerText.setText("Level complete!");
        this.bannerHint.setText("Get ready for Level " + this.advanceLevel + "...");
        this.time.delayedCall(1800, this.goToAdvance, [], this);
      } else {
        this.showWin();
      }
    }

    goToAdvance() {
      if (this.restarting) {
        return;
      }
      this.restarting = true;
      this.scene.restart({ level: this.advanceLevel });
    }

    restartLevel() {
      if (this.restarting) {
        return;
      }
      this.restarting = true;
      this.scene.restart({ level: this.level });
    }

    updateEnemyPatrol(enemy) {
      if (!enemy.active || !enemy.body) {
        return;
      }
      var body = enemy.body;
      var sp = enemy.walkSpeed || ENEMY_SPEED;
      if (body.blocked.left || body.touching.left) {
        enemy.setVelocityX(sp);
        enemy.setFlipX(false);
        return;
      }
      if (body.blocked.right || body.touching.right) {
        enemy.setVelocityX(-sp);
        enemy.setFlipX(true);
        return;
      }
      if (!(body.blocked.down || body.touching.down)) {
        return;
      }
      if (Math.abs(body.velocity.x) < 10) {
        enemy.setVelocityX(sp);
        enemy.setFlipX(false);
      }
      var dir = body.velocity.x >= 0 ? 1 : -1;
      var probeX = enemy.x + dir * (body.width / 2 + 4);
      var probeY = enemy.y + body.height / 2 + 6;
      var grounded = false;
      var plats = this.platforms.getChildren();
      for (var i = 0; i < plats.length; i++) {
        var b = plats[i].body;
        if (!b || !b.enable || b.checkCollision.none) {
          continue;
        }
        if (probeX >= b.left && probeX <= b.right && probeY >= b.top && probeY <= b.bottom + 8) {
          grounded = true;
          break;
        }
      }
      if (!grounded) {
        enemy.setVelocityX(-dir * sp);
        enemy.setFlipX(dir > 0);
      }
    }

    isInWater(x, y) {
      var zones = this.waterZones || [];
      var i;
      for (i = 0; i < zones.length; i++) {
        var z = zones[i];
        if (x >= z.x && x <= z.x + z.width && y >= z.y && y <= z.y + z.height) {
          return true;
        }
      }
      return false;
    }

    updateFormFromTerrain() {
      if (!this.player || this.won || this.completing || this.restarting) {
        return;
      }
      this.setForm(this.isInWater(this.player.x, this.player.y) ? "shark" : "kid");
    }

    setForm(form, silent) {
      if (form !== "kid" && form !== "shark") {
        return;
      }
      if (this.form === form) {
        return;
      }
      var previous = this.form;
      this.form = form;
      this.underwater = form === "shark";
      if (form === "shark") {
        this.player.setTexture("shark-kid");
        this.physics.world.gravity.y = 360;
        this.player.setMaxVelocity(240, 700);
        if (this.dorsalFin) {
          this.dorsalFin.setVisible(true);
        }
        if (this.tailFin) {
          this.tailFin.setVisible(true);
        }
        this.sharkFins = true;
      } else {
        this.player.setTexture("kid");
        this.physics.world.gravity.y = 980;
        this.player.setMaxVelocity(320, 1100);
        if (this.dorsalFin) {
          this.dorsalFin.setVisible(false);
        }
        if (this.tailFin) {
          this.tailFin.setVisible(false);
        }
        this.sharkFins = false;
      }
      if (previous) {
        if (form === "shark") {
          this.player.body.setSize(36, 22);
          this.player.body.setOffset(14, 10);
          this.player.y += 10;
        } else {
          this.player.body.setSize(22, 36);
          this.player.body.setOffset(5, 10);
          this.player.y -= 10;
        }
      }
      if (!silent && previous) {
        this.playFormSplash();
      }
    }

    playFormSplash() {
      if (!this.player || !this.textures.exists("bubble-dot")) {
        return;
      }
      var px = this.player.x;
      var py = this.player.y;
      var i;
      for (i = 0; i < 10; i++) {
        var ang = (i / 10) * Math.PI * 2;
        var img = this.add.image(px, py, "bubble-dot").setDepth(12).setScale(0.8 + Math.random() * 0.6);
        this.tweens.add({
          targets: img,
          x: px + Math.cos(ang) * (16 + Math.random() * 18),
          y: py + Math.sin(ang) * (12 + Math.random() * 14) - 8,
          alpha: 0,
          duration: 280 + Math.random() * 180,
          onComplete: function () {
            img.destroy();
          }
        });
      }
    }

    updateSharkFins(delta) {
      if (!this.sharkFins || !this.player) {
        return;
      }
      var p = this.player;
      var facing = p.flipX ? -1 : 1;
      var sx = this.artSX || 1;
      var sy = this.artSY || 1;
      var ang = this.artAngle || 0;
      var rad = ang * Math.PI / 180;
      var cos = Math.cos(rad);
      var sin = Math.sin(rad);
      var half = p.height / 2;
      var feetY = p.y + half;
      // Place a fin at an offset from the player's center, following the art's tilt and squash
      var place = function (img, dx, dy) {
        var lx = dx * sx;
        var ly = (dy - half) * sy;
        img.x = p.x + lx * cos - ly * sin;
        img.y = feetY + lx * sin + ly * cos;
        img.setScale(sx, sy);
      };
      place(this.dorsalFin, 1 * facing, -7);
      this.dorsalFin.setFlipX(p.flipX);
      this.tailFin.setOrigin(p.flipX ? 0 : 1, 0.5);
      place(this.tailFin, -18 * facing, 1);
      this.tailFin.setFlipX(p.flipX);
      var wag = 0;
      if (Math.abs(p.body.velocity.x) > 8) {
        this.finTime += delta;
        wag = Math.sin(this.finTime * 0.018) * 16;
      }
      this.dorsalFin.setAngle(wag * facing + ang);
      this.tailFin.setAngle(-wag * facing + ang);
    }

    updateMovingPlatforms() {
      if (!this.movingPlatforms) {
        return;
      }
      var list = this.movingPlatforms.getChildren();
      var i;
      for (i = 0; i < list.length; i++) {
        var m = list[i];
        if (!m.body || m.isSwing) {
          continue;
        }
        if (m.axis === "y") {
          if (m.y <= m.minY) {
            m.y = m.minY;
            m.body.setVelocityY(m.moveSpeed);
          } else if (m.y >= m.maxY) {
            m.y = m.maxY;
            m.body.setVelocityY(-m.moveSpeed);
          }
          continue;
        }
        if (m.x <= m.minX) {
          m.x = m.minX;
          m.body.setVelocityX(m.moveSpeed);
        } else if (m.x >= m.maxX) {
          m.x = m.maxX;
          m.body.setVelocityX(-m.moveSpeed);
        }
      }
    }

    update(time, delta) {
      var dt = delta || 16;
      this.updateFormFromTerrain();
      this.updateMovingPlatforms();
      this.updateSwings(time);
      this.updateFlyers(time);
      this.updateHazards(time);
      this.updateBoss(time);
      this.updatePlayerArt(dt);
      this.updateSharkFins(dt);
      if (this.darkness && this.player) {
        this.darkness.setPosition(this.player.x, this.player.y);
      }

      if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
        if (this.won) {
          this.scene.restart({ level: 1 });
        } else if (this.completing) {
          this.goToAdvance();
        } else {
          this.restartLevel();
        }
        return;
      }

      var enemies = this.enemies.getChildren();
      for (var i = 0; i < enemies.length; i++) {
        this.updateEnemyPatrol(enemies[i]);
        if (enemies[i].rolls && enemies[i].active && enemies[i].body) {
          enemies[i].angle += enemies[i].body.velocity.x * dt * 0.012;
        }
      }

      if (this.won || this.completing || this.restarting) {
        this.player.setVelocityX(0);
        return;
      }

      if (this.player.y > WORLD_HEIGHT + 20) {
        this.loseLife();
        return;
      }

      if (this.inLava()) {
        this.loseLife();
        return;
      }

      var pad = window.__makoTouch || {};
      var left = this.cursors.left.isDown || this.keyA.isDown || this.touchLeft || !!pad.left;
      var right = this.cursors.right.isDown || this.keyD.isDown || this.touchRight || !!pad.right;
      var jump = this.cursors.up.isDown || this.keyW.isDown || this.keySpace.isDown || this.touchJump || !!pad.jump;
      var onGround = this.player.body.blocked.down || this.player.body.touching.down;
      var moveSpeed = this.underwater ? WATER_MOVE_SPEED : MOVE_SPEED;
      var jumpVel = this.underwater ? WATER_JUMP_VELOCITY : JUMP_VELOCITY;

      var targetVx = 0;
      if (left) {
        targetVx = -moveSpeed;
        this.player.setFlipX(true);
      } else if (right) {
        targetVx = moveSpeed;
        this.player.setFlipX(false);
      }
      var push = this.windAt(this.player.x, this.player.y);
      if (this.time.now < this.iceUntil) {
        // Slippery: speed changes slowly, so you slide
        var cur = this.player.body.velocity.x;
        var f = 1 - Math.pow(0.955, dt / 16.7);
        this.player.setVelocityX(cur + (targetVx - cur) * f + push);
      } else {
        this.player.setVelocityX(targetVx + push);
      }

      if (jump && onGround) {
        this.player.setVelocityY(jumpVel);
      }
    }
  }

  var config = {
    type: Phaser.AUTO,
    parent: "game",
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#87c5d6",
    pixelArt: true,
    roundPixels: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 980 },
        debug: false
      }
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: MainScene
  };

  window.game = new Phaser.Game(config);
  if (typeof window.applyMakoLayout === "function") {
    var applyWhenReady = function () {
      window.applyMakoLayout();
    };
    if (window.game && window.game.canvas) {
      applyWhenReady();
    } else if (window.game && window.game.events && typeof window.game.events.once === "function") {
      window.game.events.once("ready", applyWhenReady);
    }
    if (window.game && window.game.scale && window.game.scale.on) {
      window.game.scale.on("resize", function () {
        // Layout already updated from window resize; this keeps FIT in sync after rotation.
      });
    }
    window.addEventListener("resize", window.applyMakoLayout);
    window.addEventListener("orientationchange", function () {
      window.setTimeout(window.applyMakoLayout, 60);
    });
  }
})();
