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

  function readStartLevel(data) {
    if (data && (data.level === 1 || data.level === 2 || data.level === 3)) {
      return data.level;
    }
    try {
      var n = parseInt(new URLSearchParams(window.location.search).get("level"), 10);
      if (n === 1 || n === 2 || n === 3) {
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

    // Kid hero: teal cap, yellow shirt, navy shorts, white sneakers. Original, not a Nintendo look.
    g = scene.make.graphics({ add: false });
    g.fillStyle(0xf4f4f4, 1);
    g.fillRoundedRect(3, 40, 12, 8, 2);
    g.fillRoundedRect(17, 40, 12, 8, 2);
    g.fillStyle(0x2bb3a8, 1);
    g.fillRect(3, 42, 12, 3);
    g.fillRect(17, 42, 12, 3);
    g.fillStyle(0x2a2a2a, 1);
    g.fillRect(3, 46, 12, 2);
    g.fillRect(17, 46, 12, 2);
    g.fillStyle(0x24344d, 1);
    g.fillRoundedRect(6, 30, 20, 12, 3);
    g.fillStyle(0xf2c14e, 1);
    g.fillRoundedRect(6, 16, 20, 16, 4);
    g.fillStyle(0xffe0b3, 1);
    g.fillRect(2, 18, 5, 12);
    g.fillRect(25, 18, 5, 12);
    g.fillStyle(0xffe0b3, 1);
    g.fillCircle(16, 11, 9);
    g.fillStyle(0x3d2b1f, 1);
    g.fillEllipse(6, 10, 6, 8);
    g.fillEllipse(26, 10, 6, 8);
    g.fillStyle(0x1a8f86, 1);
    g.fillEllipse(16, 6, 22, 12);
    g.fillStyle(0x146f68, 1);
    g.fillRect(16, 8, 14, 3);
    g.fillStyle(0x2bb3a8, 1);
    g.fillEllipse(16, 4, 16, 7);
    g.fillStyle(0x1a1a1a, 1);
    g.fillCircle(13, 12, 1.8);
    g.fillCircle(19, 12, 1.8);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(13.6, 11.4, 0.7);
    g.fillCircle(19.6, 11.4, 0.7);
    g.lineStyle(1.5, 0xc47a5a, 1);
    g.beginPath();
    g.arc(16, 14, 3, 0.15, Math.PI - 0.15, false);
    g.strokePath();
    g.generateTexture("kid", 32, 48);
    g.destroy();

    // Shark kid body (fins are separate, so they can wag). Mako-blue back, white belly, friendly grin, big eyes.
    g = scene.make.graphics({ add: false });
    // Sleek mako torpedo body. Fins are separate textures so they can wag.
    // Metallic blue back, white belly, pointed snout. Hitbox stays on this 64x40 sprite.
    g.fillStyle(0x1e5a7a, 1);
    g.fillEllipse(34, 19, 48, 15);
    g.fillStyle(0x2f7398, 1);
    g.fillEllipse(35, 21, 48, 13);
    g.fillStyle(0x5aa3c4, 1);
    g.fillEllipse(34, 16, 36, 6);
    g.fillStyle(0xf5f7f8, 1);
    g.fillEllipse(36, 26, 44, 9);
    // tapered rear
    g.fillStyle(0x1e5a7a, 1);
    g.fillTriangle(8, 21, 22, 13, 22, 24);
    g.fillStyle(0xf5f7f8, 1);
    g.fillTriangle(10, 21, 22, 21, 22, 27);
    // pointed conical snout
    g.fillStyle(0x2f7398, 1);
    g.fillTriangle(48, 14, 63, 21, 48, 23);
    g.fillStyle(0x1e5a7a, 1);
    g.fillTriangle(48, 14, 63, 21, 54, 17);
    g.fillStyle(0xf5f7f8, 1);
    g.fillTriangle(48, 22, 63, 21, 48, 28);
    // smaller side pectoral fin, still pointed and swept
    g.fillStyle(0x1a4d6a, 1);
    g.fillTriangle(30, 26, 22, 33, 33, 27);
    g.fillStyle(0x2f7398, 1);
    g.fillTriangle(30, 26, 24, 32, 32, 27);
    // 5 gill slits
    g.lineStyle(1.4, 0x163044, 1);
    var gs;
    for (gs = 0; gs < 5; gs++) {
      g.beginPath();
      g.moveTo(39 + gs * 2.4, 16);
      g.lineTo(37 + gs * 2.4, 25);
      g.strokePath();
    }
    // smaller friendly eye with a highlight
    g.fillStyle(0xffffff, 1);
    g.fillCircle(52, 17, 3.2);
    g.fillStyle(0x163044, 1);
    g.fillCircle(52.5, 17, 1.9);
    g.fillStyle(0x0a1520, 1);
    g.fillCircle(52.8, 17, 1.1);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(53.6, 16.2, 0.8);
    // friendly grin with a few small white triangle teeth
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

    // Shorter triangular dorsal fin, proportionate to the body (origin at bottom center)
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x1a4d6a, 1);
    g.fillTriangle(2, 21, 9, 1, 16, 21);
    g.fillStyle(0x2f7398, 1);
    g.fillTriangle(4, 21, 9, 6, 14, 21);
    g.fillStyle(0x1e5a7a, 1);
    g.fillTriangle(9, 1, 16, 21, 13, 21);
    g.generateTexture("shark-dorsal", 18, 22);
    g.destroy();

    // Smaller crescent / forked tail, both lobes. Attachment is the right edge. Still wags.
    g = scene.make.graphics({ add: false });
    g.fillStyle(0x1a4d6a, 1);
    g.fillTriangle(1, 1, 23, 14, 10, 13);
    g.fillTriangle(2, 27, 23, 14, 10, 15);
    g.fillStyle(0x2f7398, 1);
    g.fillTriangle(5, 4, 22, 14, 11, 13);
    g.fillTriangle(6, 24, 22, 14, 11, 15);
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
    plat.body.allowGravity = false;
    plat.body.immovable = true;
    plat.body.setSize(width, 16);
    plat.body.setVelocityX(speed);
    plat.minX = minX;
    plat.maxX = maxX;
    plat.moveSpeed = Math.abs(speed);
    scene.movingPlatforms.add(plat);
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

      makeTextures(this);

      this.physics.world.checkCollision.down = false;
      this.physics.world.gravity.y = 980;

      if (this.level === 3) {
        this.add.tileSprite(0, 0, 8000, 450, "water-grad").setOrigin(0, 0).setScrollFactor(0.08).setDepth(0);
        this.cameras.main.setBackgroundColor(0x1a5878);
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
      this.movingPlatforms = this.physics.add.group();

      if (this.level === 3) {
        buildLevel3(this);
      } else if (this.level === 2) {
        buildLevel2(this);
      } else {
        buildLevel1(this);
      }

      this.physics.world.setBounds(0, 0, this.worldWidth, WORLD_HEIGHT);
      this.cameras.main.setBounds(0, 0, this.worldWidth, WORLD_HEIGHT);

      this.player = this.physics.add.sprite(80, 340, "kid");
      this.player.setCollideWorldBounds(true);
      this.player.setDepth(10);
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

      this.physics.add.collider(this.player, this.platforms);
      this.physics.add.collider(this.enemies, this.platforms);
      this.physics.add.collider(this.player, this.movingPlatforms);
      this.physics.add.collider(this.player, this.bubblePlatforms, null, this.passFromBelow, this);
      this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
      this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
      this.physics.add.overlap(this.player, this.springs, this.hitSpring, null, this);
      this.physics.add.overlap(this.player, this.jellies, this.hitJelly, null, this);
      this.physics.add.overlap(this.player, this.flag, this.reachGoal, null, this);

      this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
      this.cameras.main.setDeadzone(80, 40);

      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
      this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

      this.add.text(16, 10, "Mako's World", {
        fontFamily: "sans-serif",
        fontSize: "20px",
        color: "#ffffff",
        stroke: "#1a1a22",
        strokeThickness: 5
      }).setScrollFactor(0).setDepth(20);

      var levelLabel = this.level === 3 ? "Level 3  ·  Underwater" : ("Level " + this.level);
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

      this.add.text(GAME_WIDTH - 16, 12, "Move: Arrows or A/D    Jump: Space, Up, or W    Restart: R", {
        fontFamily: "sans-serif",
        fontSize: "13px",
        color: "#ffffff",
        stroke: "#1a1a22",
        strokeThickness: 3
      }).setOrigin(1, 0).setScrollFactor(0).setDepth(20);

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
      this.restartLevel();
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
        this.restartLevel();
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
      if (this.level === 1 || this.level === 2) {
        this.completing = true;
        this.advanceLevel = this.level + 1;
        this.bannerText.setText("Level complete!");
        this.bannerHint.setText("Get ready for Level " + this.advanceLevel + "...");
        this.time.delayedCall(1800, this.goToAdvance, [], this);
      } else {
        this.won = true;
        this.bannerText.setText("You win!");
        this.bannerHint.setText("Press R or click to play again");
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
      if (body.blocked.left || body.touching.left) {
        enemy.setVelocityX(ENEMY_SPEED);
        enemy.setFlipX(false);
        return;
      }
      if (body.blocked.right || body.touching.right) {
        enemy.setVelocityX(-ENEMY_SPEED);
        enemy.setFlipX(true);
        return;
      }
      if (!(body.blocked.down || body.touching.down)) {
        return;
      }
      if (Math.abs(body.velocity.x) < 10) {
        enemy.setVelocityX(ENEMY_SPEED);
        enemy.setFlipX(false);
      }
      var dir = body.velocity.x >= 0 ? 1 : -1;
      var probeX = enemy.x + dir * (body.width / 2 + 4);
      var probeY = enemy.y + body.height / 2 + 6;
      var grounded = false;
      var plats = this.platforms.getChildren();
      for (var i = 0; i < plats.length; i++) {
        var b = plats[i].body;
        if (probeX >= b.left && probeX <= b.right && probeY >= b.top && probeY <= b.bottom + 8) {
          grounded = true;
          break;
        }
      }
      if (!grounded) {
        enemy.setVelocityX(-dir * ENEMY_SPEED);
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
      var facing = this.player.flipX ? -1 : 1;
      this.dorsalFin.x = this.player.x + 1 * facing;
      this.dorsalFin.y = this.player.y - 7;
      this.dorsalFin.setFlipX(this.player.flipX);
      this.tailFin.setOrigin(this.player.flipX ? 0 : 1, 0.5);
      this.tailFin.x = this.player.x - 18 * facing;
      this.tailFin.y = this.player.y + 1;
      this.tailFin.setFlipX(this.player.flipX);
      if (Math.abs(this.player.body.velocity.x) > 8) {
        this.finTime += delta;
        var wag = Math.sin(this.finTime * 0.018) * 16;
        this.dorsalFin.setAngle(wag * facing);
        this.tailFin.setAngle(-wag * facing);
      } else {
        this.dorsalFin.setAngle(0);
        this.tailFin.setAngle(0);
      }
    }

    updateMovingPlatforms() {
      if (!this.movingPlatforms) {
        return;
      }
      var list = this.movingPlatforms.getChildren();
      var i;
      for (i = 0; i < list.length; i++) {
        var m = list[i];
        if (!m.body) {
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
      this.updateFormFromTerrain();
      this.updateSharkFins(delta || 16);
      this.updateMovingPlatforms();

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
      }

      if (this.won || this.completing || this.restarting) {
        this.player.setVelocityX(0);
        return;
      }

      if (this.player.y > WORLD_HEIGHT + 20) {
        this.restartLevel();
        return;
      }

      var left = this.cursors.left.isDown || this.keyA.isDown;
      var right = this.cursors.right.isDown || this.keyD.isDown;
      var jump = this.cursors.up.isDown || this.keyW.isDown || this.keySpace.isDown;
      var onGround = this.player.body.blocked.down || this.player.body.touching.down;
      var moveSpeed = this.underwater ? WATER_MOVE_SPEED : MOVE_SPEED;
      var jumpVel = this.underwater ? WATER_JUMP_VELOCITY : JUMP_VELOCITY;

      if (left) {
        this.player.setVelocityX(-moveSpeed);
        this.player.setFlipX(true);
      } else if (right) {
        this.player.setVelocityX(moveSpeed);
        this.player.setFlipX(false);
      } else {
        this.player.setVelocityX(0);
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
})();
