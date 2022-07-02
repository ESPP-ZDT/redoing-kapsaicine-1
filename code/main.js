import weapon from "./weapon"
import kaboom from "kaboom"
import loadAssets from "./assets"
import {addDialog} from './adddialog.js'
import characters from './npcs'
import patrol from "./patrol"

kaboom({
  background: [255, 250, 205],
  width: 800,
  height: 600,
  scale: 1.3
});

loadAssets()
play('wuja theme')
let level_id = 0
const HERO_SPEED = 300 //hero movement speed variable
const JUMP_SPEED = 600 //hero movement speed variable
const DRAGON_SPEED = 100
const BULLET_SPEED = 800

scene("game", ({level_id}) => {
  gravity(1600)
    
  const hero = add([
    sprite('hero'),
    pos(width()/2,height()/2),
    area({width: 300 , height: 632}),
    scale(0.07),
    health(120),
    solid(),
    body(),
    origin('center'),
    'stupid',
    z(16),
    health(100)
    //body()
  ])
  const projector = add([
  	pos(),
  	sprite("projector"),
  	origin("center"),
    //color(105,105,105),
    scale(0.01),
    //health(1000),
  	follow(hero, vec2(0, -17)),
    z(21),
    opacity(0)
  ])
  const armor = add([
  	pos(),
  	sprite("armor1"),
  	origin("center"),
    //color(105,105,105),
    scale(0.03),
    //health(1000),
  	follow(hero, vec2(0, -8)),
    z(20),
    opacity(1),
    color(255,255,255)
  ])
  
  //projector.opacity = 0
  //HERO CAMERA AND DEATH
  hero.onUpdate(() =>{
    camPos(hero.pos)
    if (hero.health <= 0){
      go('lose')
    }
  })
  
  const dirs = {
		"left": LEFT,
		"right": RIGHT,
		"up": UP,
		"down": DOWN,
    
	}

	for (const dir in dirs) {
		onKeyPress(dir.LEFT, () => {
			dialog.dismiss()
		})
    onKeyPress(dir.RIGHT, () => {
			dialog.dismiss()
      
		})
    onKeyPress(dir.UP, () => {
			dialog.dismiss()
		})
    onKeyPress(dir.DOWN, () => {
			dialog.dismiss()
      
		})
    
		onKeyDown(dir, () => {
			hero.move(dirs[dir].scale(HERO_SPEED))
		})
	}

  onKeyPress("space", () => {
		// these 2 functions are provided by body() component
        if (hero.isClimbing) {
            hero.use(body())
        }
		if (hero.isClimbing || hero.isGrounded()) {
			hero.jump(JUMP_SPEED)
		}
        if (hero.isClimbing) {
            hero.weight = 1
            hero.isClimbing = false
            // return
        }
    //burp()

	})
  
  onKeyDown('right', () => {
    projector.angle = 90
    hero.flipX(true)
    armor.flipX(true)
      if (hero.isClimbing) {
              hero.use(body())
              hero.weight = 1
              hero.isClimbing = false
          }
        
  });
  onKeyDown('left', () => {
    projector.angle = 270
    hero.flipX(false)
    armor.flipX(false)
      if (hero.isClimbing) {
                hero.use(body())
                hero.weight = 1
                hero.isClimbing = false
            }
  });

  onKeyPress('down', () => {
    hero.move(0, HERO_SPEED)
    hero.weight = 3
    projector.angle = 180

  
    
  });
  onKeyRelease('down', () => {
    hero.weight = 1
    
  });
  
  onKeyDown('up', () => {
      projector.angle = 0
        if (hero.touchingLadder) {
                hero.isClimbing = true
                hero.unuse("body")
                hero.move(0, -HERO_SPEED)
                // player.weight = 0
            }
        })


  onKeyPress("t", ()=>{
    play('bullet shoot')

    let laser = add([
  	// list of components
  	  sprite("anisebullet"),
      //scale(0.18),
  	  pos(projector.pos.x, projector.pos.y),
      origin("center"),
  	  area(scale(0.5)),//{
        //width:30,
        //height: 30
      
      move(projector.angle-90, 500),
      cleanup(),
      'laser'
    ])
  
    laser.angle = projector.angle

})
  
  //LADDER ON UPDATE
  hero.onUpdate(() => {
        // debug.log(player.weight)
        const ladders = get("ladder")
        hero.touchingLadder = false
        for (const ladder of ladders) {
            if (hero.isColliding(ladder)) {
                hero.touchingLadder = true
                break
            }
        }
        // if (!player.touchingLadder && player.isClimbing) {
        //     // player.weight = 1
        //     // player.isClimbing = false
        // }
    })
  
  
  hero.onCollide("portal", (portal) => {
    level_id++
    

    
    if (level_id < maps.length){
      
      go('game',{level_id})
    }else{
      go('win')
    }
    
  })


  //collider 1 = !
  
  maps = [
      [
      "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "m      H  mm                                                                                                 m",
      "m   u  H  mm                                                                                                   m",
      "m      H  mm                                                                                                     m",
      "m      H  mm                                                                                                   m",
      "mq l   H  mm                                                                                              mm",
      "mffffffH  mm                                                                                          $-   mm",
      "m      H                                                                                             $-     m",
      "m      H                                                                                                $- m",
      "m      H  mm                                                                                               m",
      "m      H  mm                                                                                               m",
      "m      H  mm                                                                                            m",
      "ms  k eH  mm                                                                                             o m",
      "mffffffH  m                                                                                            mmm",
      "m      H  m                                                                                                mmm",
      "m      H  mm                                                                                           m",
      "m      H  mm                                                                                           m",
      "m      H                                                                                            m",
      "m a d* H      p                                                                                      m",
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      ],
      [
      "fffffffffffffffffffff",
      "m         H        m",
      "m         H        m",
      "m         H        m",
      "m         H   ---     m",
      "m         H        m",
      "mfffff   fH       fm",
      "m         H        m",
      "m                  m",
      "m         H        m",
      "m         H        m",
      "m         H        m",
      "m         H       om",
      "mwwww           fffm",
      "mfffffffff         m",
      "m         H        m",
      "m         H        m",
      "m         H        m",
      "m         H       pm",
      "ffffffffffffffffffff"
      ],
      [
      "ffffffffffffffffffffffffffffffffffffffffff",
      "m         H                              m",
      "m         H    ---                          m",
      "m         H                              m",
      "m         H                              m",
      "m         H                              m",
      "mfffff   fH                             fm",
      "m         H        m",
      "m                  m",
      "m         H        m",
      "m         H        m",
      "m         H        m",
      "m         H       om",
      "mwwww           fffm",
      "mfffffffff         m",
      "m         H        m",
      "m         H        m",
      "m         H        m",
      "m         H       pm",
      "ffffffffffffffffffff"
      ],
    
      [
        "ffffffffffffffffffffffffffffffffffffffffff",
        "m         H                              m",
        "m         H    ---                          m",
        "m         H                              m",
        "m         H                              m",
        "m         H                              m",
        "mfffff   fH                             fm",
        "m         H                      m",
        "m                  m",
        "m         H        m",
        "m         H        m",
        "m         H        m",
        "m         H       om",
        "mwwww           fffm",
        "mfffffffff         m",
        "m         H        m",
        "m         H        m",
        "m         H        m",
        "m         H       pm",
        "ffffffffffffffffffff"
        ],
      [
        "ffffffffffffffffffffffffffffffffffffffffff",
        "m         H                              m",
        "m         H    ---                          m",
        "m         H                              m",
        "m         H                              m",
        "m         H                              m",
        "mfffff   fH                             fm",
        "m         H                      m",
        "m                  m",
        "m         H        m",
        "m         H        m",
        "m         H        m",
        "m         H       om",
        "mwwww           fffm",
        "mfffffffff         m",
        "m         H        m",
        "m         H        m",
        "m         H        m",
        "m         H       pm",
        "ffffffffffffffffffff"
        ],
        [
        "ffffffffffffffffffffffffffffffffffffffffff",
        "m         H                              m",
        "m         H    ---                          m",
        "m         H                              m",
        "m         H                              m",
        "m         H                              m",
        "mfffff   fH                             fm",
        "m         H                      m",
        "m                  m",
        "m         H        m",
        "m         H        m",
        "m         H        m",
        "m         H       om",
        "mwwww           fffm",
        "mfffffffff         m",
        "m         H        m",
        "m         H        m",
        "m         H        m",
        "m         H       pm",
        "ffffffffffffffffffff"
        ],
      
    ]
  
  current_map = maps[level_id]
  //let enemies = ['imbirwar2','lassie','halaraptor','piripiripyro', 'lassiedragon','kapsaicine']

  let levelcfg = {
    width:64,//width of all of the sprites on map  
    height:64,
    pos:vec2(0,0),
    '-': () =>[
      sprite("dragon1"),
      pos(),
	    origin("center"),
      area(),
      'dragon',
      scale(0.13),
	// This enemy cycle between 3 states, and start from "idle" state
	    state("move", [ "idle", "attack", "move", ]),
      ],
    
    'm': () =>[
      sprite('clovewall'),//wall sprite
        'wall',
        area(),
        solid(),
        scale(0.07)
      ],
    'f': () =>[
      sprite('clovefloor'),//floor sprite
        'floor',
        area(scale(1,0.5)),
        solid(),
        z(2),
        scale(0.07),
        origin('center')
      
      ],
    '$': () =>[
      sprite('mobcol1'),//floor sprite
        'mobcollider1',
        area(scale(1,0.5)),
        solid(),
        z(2),
        scale(0.10),
        origin('center')
      
      ],
    'p': () =>[
      sprite('portal'),
        'portal',
        z(17),
        scale(0.07),
        area(),
      ],
    "H": () => [
  		sprite("ladder"),
  		area(),
  		origin("bot"),
  		"ladder",
      scale(0.07),
  	  ],
    "w": () => [
  		sprite("paprikawraith"),
  		area(),
  		origin("center"),
  		"enemy",'paprika',
      patrol(),
      scale(0.07),
  	  ],
    "d": () => [
  		sprite("bean"),
  		area(),
  		origin("center"),
  		'bean',
    
  	  ],
    's': () =>[
      sprite('spicelord1'),
        'spicelord1',
        z(17),
        scale(0.09),
        area(),
      ],
    'l': () =>[
      sprite('sergeant'),
        'sergeant',
        z(17),
        scale(0.09),
    
      ],
    "o": () => [
  		sprite("monk"),
  		area(),
  		origin("center"),
  		'monk','halapeno',
      scale(0.07),
  	  ],
    "u": () => [
  		sprite("healer"),
  		area(),
  		origin("center"),
  		'ultrahero','healer',
      scale(0.23),
  	  ],
    "e": () => [
  		sprite("projector"),
  		area(),
  		origin("center"),
  	'weapon1',
      scale(0.03),
  	  ],
    "*": () => [
  		sprite("husaria"),
  		area(),
  		origin("center"),
  	'husaria_armor',
      scale(0.03),
  	  ],
    
    
    any(ch) {
			const char = characters[ch]
			if (char) {
				return [
					sprite(char.sprite),
					area(),
					solid(),
          scale(char.scale),
					// here
					//scale(char.scale),
					"character",
					{ msg: char.msg, },
				]
			}
		},
    
  }
  const game_level = addLevel(current_map, levelcfg)
  
 let dragon = [get("dragon")[0],get("dragon")[1],get("dragon")[2]]
  // Run the callback once every time we enter "idle" state.
// Here we stay "idle" for 0.5 second, then enter "attack" state.
  dragon.forEach(mob =>{
    mob.onStateEnter("idle", async () => {
  	await wait(0.5)
  	mob.enterState("attack")
  })
    mob.onCollide("mobcollider1", (collider) => {
		  collider.destroy()
      mob.use(sprite("lassie"))
    
	})
  // When we enter "attack" state, we fire a bullet, and enter "move" state after 1 sec
  mob.onStateEnter("attack", async () => {
  
  	// Don't do anything if player doesn't exist anymore
  	if (hero.exists()) {
  
  		const dir = hero.pos.sub(mob.pos).unit()
  
  		add([
  			pos(mob.pos),
  			move(dir, BULLET_SPEED),
  			rect(12, 12),
  			area(),
  			cleanup(),
  			origin("center"),
  			color(BLUE),
  			"bullet",
  		])
  
  	}
  
  	await wait(1)
  	mob.enterState("move")
  
  })
  
  mob.onStateEnter("move", async () => {
  	await wait(2)
  	mob.enterState("idle")
  })
  
  // Like .onUpdate() which runs every frame, but only runs when the current state is "move"
  // Here we move towards the player every frame if the current state is "move"
  mob.onStateUpdate("move", () => {
  	if (!hero.exists()) return
  	const dir = hero.pos.sub(mob.pos).unit()
  	mob.move(dir.scale(DRAGON_SPEED))
    })
  // Have to manually call enterState() to trigger the onStateEnter("move") event we defined above.
  mob.enterState("move")
    
    
  })
  

  


  
  const dialog = addDialog()
  const level_label = add([
    text('level ' + level_id),
    pos(0,0),
    scale(0.3),
    fixed(),
    z(17),
  ])
  const health_label = add([
    text('health ' + hero.hp()),
    pos(400,0),
    scale(0.3),
    fixed(),
    z(190)
  ])
  


  hero.onCollide("dragon", () => {
    //play('halape')
		hero.hurt(100)
   // health_label.text = health: ${hero.hp()}
    health_label.text = `Hero health: ${hero.hp()}`
    debug.log('hero health' +hero.hp())
    go('lose')
    //burp()
    
	})
  hero.onCollide("character", (ch) => {
		dialog.say(ch.msg)
    console.log('colliding')
	})
  hero.onCollide("monk", () => {
    armor.use(sprite("mark"))
    play('halape')
		hero.heal(100)
   // health_label.text = health: ${hero.hp()}
    health_label.text = `Hero health: ${hero.hp()}`
    debug.log('hero health' +hero.hp())
    //burp()
    
	})
  hero.onCollide("healer", () => {
    play('healer hero')
		hero.heal(100)
   // health_label.text = health: ${hero.hp()}
    health_label.text = `Hero health: ${hero.hp()}`
    //debug.log('hero health' +hero.hp())
    //burp()
    
	})
  hero.onCollide("bean", () => {
    burp()
	})
  hero.onCollide("spicelord1", () => {
    play('spicelord1sound')
	})
  hero.onCollide("weapon1", (weapon) => {
    play('clove king')
    weapon.destroy()
    projector.opacity = 1
    //laser.use(sprite(''))
    debug.log('t to shoot')
    
	})
  hero.onCollide("husaria_armor", (husaria) => {
    //play('clove king')
    //laser.use(sprite("anisebullet"))
    armor.use(sprite("husaria"))
    husaria.destroy()
    armor.opacity = 1
    
	})
  onCollide("laser","enemy", (laser, enemy) =>{
  enemy.destroy()
  play('monster death 1')
  laser.destroy()
})
  onCollide("laser","dragon", (laser, enemy) =>{
  enemy.destroy()
  play('monster death 1')
  laser.destroy()
})

  
  //const game_level = addLevel(current_map, levelcfg)

})

go('game', {level_id})

scene('lose', () =>{
  add([
    text('it ends'),
    color(0,0,0),
    origin('center'),
    pos(width()/2, height() /2)
    
  ])
  onKeyPress(() => {
    go('game',{level_id:0})
  })
})

scene('win', () =>{
  add([
    text('you won'),
    color(0,0,0),
    origin('center'),
    pos(width()/2, height() /2)
    
  ])
  onKeyPress(() => {
    go('game',{level_id:0})
  })
})