# ARCH.md — mapa de arquitetura e de CONFLITO (CS BRASIL / CORO SOLTO)

<!-- BEGIN:GERADO — não edite à mão, rode `npm run arch` -->

> Gerado por `node tools/gen-arch.mjs`. **Não edite este bloco à mão.**
> Versão do jogo: 2.1.0-alpha.81 · `npm run arch` para regenerar · `npm run arch:check` no CI.

## Tamanho dos arquivos indexados

| Arquivo | Linhas | Símbolos |
|---|---:|---:|
| `public/js/game.js` | 8432 | 332 |
| `public/js/main.js` | 4506 | 336 |
| `public/js/glbchars.js` | 855 | 60 |
| `public/js/characters.js` | 1143 | 42 |
| `public/js/vmattach.js` | 633 | 4 |
| `public/js/springs.js` | 260 | 28 |
| `public/js/weapons.js` | 354 | 22 |

## Maiores métodos de `game.js` — onde o conflito mora

Os 15 maiores somam **3337 linhas (40% do arquivo)**. Método grande = PR irrevisável e merge conflitante.

| Linhas | Início | Método | |
|---:|---:|---|---|
| 838 | 7017 | `_updateBot()` | ⚠️ candidato a extração |
| 637 | 718 | `constructor()` | 🔴 append-only |
| 304 | 6119 | `_updatePlayer()` | ⚠️ candidato a extração |
| 269 | 1455 | `_buildViewModels()` |  |
| 255 | 2647 | `_resetPositions()` |  |
| 158 | 6436 | `_updatePickups()` |  |
| 137 | 5353 | `_botCtf()` |  |
| 135 | 2207 | `_touchControls()` |  |
| 101 | 6018 | `_moveEntity()` |  |
| 90 | 8291 | `update()` | 🔴 append-only |
| 88 | 8203 | `_updateHud()` |  |
| 86 | 5064 | `_initCTF()` |  |
| 81 | 3638 | `_tryShoot()` |  |
| 79 | 3284 | `_ensureVmPrecisionQa()` |  |
| 79 | 4132 | `_dmgArc()` |  |

## Tabela de CONFLITO — resolvida para as linhas de hoje

Declare sua frente antes de editar. Em `game.js` use **só a ferramenta Edit, nunca Write**.
Duas frentes com faixas disjuntas podem rodar em paralelo — foi medido: 3 agentes editaram
faixas disjuntas simultaneamente com zero conflito de conteúdo.

| Frente | Faixas em `game.js` | Arquivos exclusivos |
|---|---|---|
| **ARMAS / VIEWMODEL** | `346–349` `431–525` `555–576` `1455–1864` `3250–3283` `3480–3573` `3592–3718` `3733–3748` `3793–3862` `4393–4418` `4466–4566` `4639–4655` | `public/js/vmattach.js` `public/js/springs.js` `public/js/weapons.js` `public/js/fparms.js` `public/js/handik.js` `public/js/recoil.js` `public/js/vmlab.js` |
| **BOTS / JOGABILIDADE** | `185–188` `239–239` `265–276` `618–629` `4002–4101` `5003–5063` `5235–5489` `5572–5594` `6119–6422` `6819–6836` `6965–6995` `7017–7854` | — |
| **MAPAS / MUNDO** | `1401–1454` `2647–2901` `5064–5210` `6436–6593` | `public/js/maps.js` `public/js/mapprops.js` `public/js/map_brasilia.js` `public/js/map_havan.js` `public/js/map_piscina.js` `public/js/map_piscinao_ramos.js` `public/js/map_ferrovelho.js` |
| **GRÁFICOS / FX** | `1879–1888` `2003–2041` `3154–3166` `4419–4457` `4582–4638` | `public/js/bloom.js` `public/js/textures.js` `public/js/vao.js` `public/js/stylize.js` `public/js/gpuparticles.js` |
| **UI / HUD / MENU** | `1355–1400` `3106–3128` `3144–3153` `3167–3183` `4132–4210` `4260–4313` `4329–4392` `8025–8088` `8119–8167` `8203–8290` | `public/js/main.js` `public/style.css` `src/pages/index.astro` |
| **ÁUDIO** | — | `public/js/audio.js` |
| **PERSONAGENS** | — | `public/js/characters.js` `public/js/glbchars.js` |
| **SITE / BACKEND** | — | `src/` `supabase/` |

**🔴 Zonas vermelhas (append-only, qualquer frente pode precisar):** `update()` 8291–8380 · `_dom()` 1355–1400 · `constructor()` 718–1354

Nenhuma sobreposição entre frentes — todas as faixas são disjuntas. ✓

Cobertura: **3901 de 8432 linhas (46%)** do `game.js` têm dono declarado. O resto é território neutro — declare a frente mesmo assim.

<details><summary><strong>Índice completo de <code>game.js</code> (todos os símbolos)</strong></summary>

| Linha | Símbolo | Linhas |
|---:|---|---:|
| 48 | `ANNOUNCER_LAB` | 4 |
| 52 | `VMLAB` | 3 |
| 57 | `VM_QA_CICLO` | 3 |
| 61 | `VM_QA_ADS` | 8 |
| 69 | `VM_MAT_LEGACY` | 4 |
| 75 | `DROP_TTL` | 8 |
| 83 | `ROUNDS_MAX` | 27 |
| 111 | `CTF_ROUNDS_TO_WIN` | 4 |
| 116 | `sanitizeRounds` | 4 |
| 121 | `CTF_CLOCK_SHOW` | 4 |
| 125 | `KILLS_PER_PLAYER` | 7 |
| 132 | `PACE` | 33 |
| 165 | `PAUSE_ARM_MS` | 3 |
| 168 | `CHAT_PAUSA_GUARDA_MS` | 9 |
| 178 | `confirmGate` | 7 |
| 189 | `BOT_AIM_PITCH` | 4 |
| 193 | `BOT_DMG_PLAYER` | 21 |
| 214 | `BOT_FAIR` | 5 |
| 219 | `BOT_MOVE2` | 15 |
| 243 | `BOT_FOCUS_MIN` | 22 |
| 269 | `BOT_TOKEN_REST` | 7 |
| 277 | `MOVE_MUL` | 6 |
| 284 | `MOVE2` | 4 |
| 288 | `STEP_H` | 3 |
| 295 | `MANTLE_APOIO` | 4 |
| 299 | `MANTLE_GRID` | 5 |
| 304 | `RACK_OLD` | 4 |
| 308 | `RACK_RETA` | 25 |
| 335 | `RADIO` | 5 |
| 341 | `MK_LABELS` | 5 |
| 346 | `GUNFEEL` | 4 |
| 353 | `TRACER_STYLE` | 6 |
| 363 | `ADS_RAMPA_S` | 3 |
| 367 | `aberturaCone` | 16 |
| 383 | `anguloDeDisparo` | 4 |
| 387 | `coneDoDisparo` | 16 |
| 404 | `D2R` | 4 |
| 408 | `DMG_FALLOFF` | 5 |
| 413 | `HS_MUL` | 3 |
| 416 | `BALL_CLASS` | 15 |
| 431 | `STATIC_CLASS` | 75 |
| 507 | `VM_KNOB` | 19 |
| 526 | `vmAdsRot` | 4 |
| 531 | `vmFovForAspect` | 24 |
| 555 | `VM_OFF` | 22 |
| 577 | `vmOffY` | 35 |
| 612 | `VMP` | 6 |
| 618 | `BOT_SKILLS` | 11 |
| 630 | `diffKey` | 4 |
| 635 | `rollBotSkill` | 7 |
| 642 | `botTier` | 4 |
| 646 | `_cyclePool` | 5 |
| 651 | `_rosterPool` | 22 |
| 675 | `_pinnedDefs` | 5 |
| 680 | `pickMatchRoster` | 21 |
| 701 | `BOT_WEAPON_POOL` | 5 |
| 706 | `pickMatchWeapons` | 9 |
| 718 | `constructor()` | 637 |
| 1355 | `_dom()` | 46 |
| 1401 | `_buildEnv()` | 54 |
| 1455 | `_buildViewModels()` | 269 |
| 1724 | `_vmFrame` | 141 |
| 1865 | `_vmMontarTardio` | 14 |
| 1879 | `_makePuffTexture()` | 10 |
| 1889 | `_makeBloodTex()` | 19 |
| 1908 | `_makeBloodPoolTex()` | 21 |
| 1929 | `_bloodDecal()` | 16 |
| 1945 | `_makeBloodFx()` | 20 |
| 1965 | `_bloodSpatter()` | 18 |
| 1983 | `_bloodPoolAt()` | 6 |
| 1989 | `_updateBlood()` | 14 |
| 2003 | `_makeFlashTex()` | 21 |
| 2024 | `_makeFlashSoftTex()` | 8 |
| 2032 | `_makeFlashCoreTex()` | 10 |
| 2042 | `_input()` | 6 |
| 2048 | `_kd` | 49 |
| 2097 | `_ku` | 5 |
| 2102 | `_md` | 40 |
| 2142 | `_mu` | 7 |
| 2149 | `_mm` | 20 |
| 2169 | `_wh` | 17 |
| 2186 | `_cc` | 1 |
| 2187 | `_blur` | 1 |
| 2188 | `_plc` | 19 |
| 2207 | `_touchControls()` | 135 |
| 2342 | `_aimAssist()` | 28 |
| 2370 | `_requestLock()` | 27 |
| 2397 | `_travaAtalhos()` | 4 |
| 2401 | `_soltaAtalhos()` | 5 |
| 2406 | `espectando()` | 2 |
| 2408 | `_acceptInput()` | 7 |
| 2415 | `travarEntrada()` | 17 |
| 2432 | `_chatSeguraPausa()` | 5 |
| 2437 | `_pauseBackdrop()` | 7 |
| 2444 | `_radioShow()` | 6 |
| 2450 | `_radioUi()` | 8 |
| 2458 | `_radioPick()` | 20 |
| 2478 | `_abilityNotice()` | 10 |
| 2488 | `_resetSliceAbilities()` | 9 |
| 2497 | `_stackTrace()` | 28 |
| 2525 | `_updateMotocaCharge()` | 10 |
| 2535 | `_recordRoutePoint()` | 11 |
| 2546 | `_routePing()` | 23 |
| 2569 | `_tickRoutePings()` | 12 |
| 2581 | `_objectiveInteractionMultiplier()` | 14 |
| 2595 | `start()` | 5 |
| 2600 | `_startAnnouncerLab()` | 9 |
| 2609 | `_startRound()` | 38 |
| 2647 | `_resetPositions()` | 255 |
| 2902 | `_checkCtfAlvo()` | 13 |
| 2915 | `_checkPace()` | 13 |
| 2928 | `_endRound()` | 34 |
| 2962 | `_roundWinnerVoice()` | 12 |
| 2974 | `_fimDaPartida()` | 7 |
| 2981 | `_endMatch()` | 61 |
| 3042 | `_ensureDolly()` | 41 |
| 3083 | `_tickDolly()` | 23 |
| 3106 | `setPaused()` | 23 |
| 3129 | `_now()` | 3 |
| 3132 | `pauseArmed()` | 1 |
| 3133 | `_syncPauseArm()` | 7 |
| 3140 | `resume()` | 4 |
| 3144 | `applySettings()` | 10 |
| 3154 | `_applyQuality()` | 13 |
| 3167 | `onResize()` | 17 |
| 3184 | `_switchTeam()` | 66 |
| 3250 | `_applyVmVisibility()` | 34 |
| 3284 | `_ensureVmPrecisionQa()` | 79 |
| 3363 | `_syncVmPresentation()` | 19 |
| 3382 | `_vmlabEnsure()` | 14 |
| 3396 | `_vmlabFrame()` | 28 |
| 3424 | `_tuneGet()` | 15 |
| 3439 | `_tune()` | 23 |
| 3462 | `_fxSet()` | 2 |
| 3464 | `_qaCicloArma()` | 8 |
| 3472 | `_cycleWeapon()` | 8 |
| 3480 | `_switchWeapon()` | 39 |
| 3519 | `_deploySfx()` | 7 |
| 3526 | `_scope()` | 17 |
| 3543 | `_zoomFov()` | 5 |
| 3548 | `_reloading()` | 1 |
| 3549 | `_startReload()` | 25 |
| 3574 | `_reloadLayers()` | 18 |
| 3592 | `_installRecoil()` | 33 |
| 3625 | `_shotRecoil()` | 13 |
| 3638 | `_tryShoot()` | 81 |
| 3719 | `_tryKnifeAttack()` | 14 |
| 3733 | `_meleeHit()` | 16 |
| 3749 | `_meleeRange()` | 5 |
| 3754 | `_botMelee()` | 28 |
| 3782 | `_shotDamage()` | 11 |
| 3793 | `_fireHitscan()` | 70 |
| 3863 | `_targetFromHit()` | 9 |
| 3872 | `_penetrationExit()` | 20 |
| 3892 | `_surfaceOf()` | 27 |
| 3919 | `_armoredTarget()` | 3 |
| 3922 | `_fleshImpact()` | 38 |
| 3960 | `_fxVoice()` | 9 |
| 3969 | `_impactSfx()` | 17 |
| 3986 | `_tintFx()` | 16 |
| 4002 | `_damage()` | 42 |
| 4044 | `_playerHurtFx()` | 5 |
| 4049 | `_kill()` | 53 |
| 4102 | `_checkArenaWin()` | 30 |
| 4132 | `_dmgArc()` | 79 |
| 4211 | `_mkBanner()` | 9 |
| 4220 | `_updateKillSequenceHud()` | 12 |
| 4232 | `_resetKillSequence()` | 5 |
| 4237 | `_playerKillFeedback()` | 18 |
| 4255 | `_acertoPrevisto()` | 5 |
| 4260 | `_hitmarker()` | 15 |
| 4275 | `_dmgNumber()` | 20 |
| 4295 | `_feed()` | 19 |
| 4314 | `_skullIcon()` | 6 |
| 4320 | `_killfeedWeaponIcon()` | 9 |
| 4329 | `_wpnIcon()` | 64 |
| 4393 | `_tracer()` | 26 |
| 4419 | `_puff()` | 39 |
| 4458 | `_holeDecalMat()` | 8 |
| 4466 | `_flash()` | 61 |
| 4527 | `_vmTetoTela()` | 10 |
| 4537 | `_muzzleWorld()` | 30 |
| 4567 | `_aimOrigin()` | 5 |
| 4572 | `_updateDoors()` | 10 |
| 4582 | `_updateFx()` | 57 |
| 4639 | `_ejectCasing()` | 17 |
| 4656 | `_makeCtfFlagTex()` | 23 |
| 4679 | `_paintFlagSymbol()` | 9 |
| 4688 | `_flagTexFor()` | 26 |
| 4714 | `_legadoSimbolo()` | 8 |
| 4722 | `_loadCtfSymbols()` | 22 |
| 4744 | `_makeCtfZoneTex()` | 31 |
| 4775 | `_makeSmokeTex()` | 10 |
| 4785 | `_updateSmokeHud()` | 4 |
| 4789 | `_grenadeSpatial()` | 14 |
| 4803 | `_spawnGrenade()` | 19 |
| 4822 | `_throwNade()` | 13 |
| 4835 | `_throwSmoke()` | 1 |
| 4836 | `_throwFrag()` | 4 |
| 4840 | `_explodeFrag()` | 40 |
| 4880 | `_corDaFumaca()` | 16 |
| 4896 | `_popSmoke()` | 23 |
| 4919 | `_updateGrenades()` | 35 |
| 4954 | `_teamColor()` | 15 |
| 4969 | `_teamInk()` | 7 |
| 4976 | `_factionOf()` | 1 |
| 4977 | `_voiceKey()` | 1 |
| 4978 | `_teamName()` | 1 |
| 4979 | `_teamTag()` | 6 |
| 4985 | `_plaqueta()` | 13 |
| 4998 | `_mirror()` | 2 |
| 5000 | `_defNoLado()` | 3 |
| 5003 | `_botSeparation()` | 61 |
| 5064 | `_initCTF()` | 86 |
| 5150 | `_updateCTF()` | 61 |
| 5211 | `_ctfWin()` | 24 |
| 5235 | `_freeYaw()` | 25 |
| 5260 | `_pullString()` | 23 |
| 5283 | `_walkReach()` | 32 |
| 5315 | `_wpComp()` | 16 |
| 5331 | `_findPathLocal()` | 22 |
| 5353 | `_botCtf()` | 137 |
| 5490 | `_hideCtfHud()` | 6 |
| 5496 | `_updateCtfHud()` | 76 |
| 5572 | `_collide()` | 23 |
| 5595 | `_collideRot()` | 22 |
| 5617 | `_mantleAlcance()` | 50 |
| 5667 | `_mantleAlcancavel()` | 12 |
| 5679 | `_mantleTarget()` | 35 |
| 5714 | `_freeSpot()` | 30 |
| 5744 | `_retaAndavel()` | 20 |
| 5764 | `_walkDepth()` | 16 |
| 5780 | `_noteHit()` | 17 |
| 5797 | `_deathFeedback()` | 45 |
| 5842 | `_toggleCamView()` | 6 |
| 5848 | `setCamView()` | 16 |
| 5864 | `_syncCamViewVis()` | 8 |
| 5872 | `_ensurePlayerTP()` | 26 |
| 5898 | `_updatePlayerTP()` | 42 |
| 5940 | `_updateCrosshairParallax()` | 47 |
| 5987 | `_tpDeath()` | 18 |
| 6005 | `_tpRevive()` | 13 |
| 6018 | `_moveEntity()` | 101 |
| 6119 | `_updatePlayer()` | 304 |
| 6423 | `_footstepSurface()` | 13 |
| 6436 | `_updatePickups()` | 158 |
| 6594 | `_wpnMode()` | 5 |
| 6599 | `_botWeapon()` | 10 |
| 6609 | `_municaoInfinita()` | 1 |
| 6610 | `_pickupAllowed()` | 9 |
| 6619 | `_grabNearPickup()` | 10 |
| 6629 | `_grabPickup()` | 35 |
| 6664 | `_assentarNoChao()` | 10 |
| 6674 | `refreshPickupModels()` | 24 |
| 6698 | `_dropWeapon()` | 20 |
| 6718 | `_sumirDrop()` | 36 |
| 6754 | `_spawnY()` | 3 |
| 6757 | `_spawnYaw()` | 5 |
| 6762 | `_pickSpawn()` | 23 |
| 6785 | `_respawnPlayer()` | 34 |
| 6819 | `_losClear()` | 18 |
| 6837 | `_botCall()` | 41 |
| 6878 | `_teamMarkTex()` | 23 |
| 6901 | `_makeTeamMark()` | 16 |
| 6917 | `_trocarPersonagem()` | 18 |
| 6935 | `_syncRemoteWeapon()` | 23 |
| 6958 | `_updateTeamMark()` | 7 |
| 6965 | `_botEye()` | 1 |
| 6966 | `_enemyOf()` | 8 |
| 6974 | `_duelToken()` | 22 |
| 6996 | `_respawnEntity()` | 21 |
| 7017 | `_updateBot()` | 838 |
| 7855 | `_flushTraining()` | 13 |
| 7868 | `_updateBotNN()` | 73 |
| 7941 | `_botShootNN()` | 46 |
| 7987 | `_radarFoot()` | 38 |
| 8025 | `_updateRadar()` | 64 |
| 8089 | `_banner()` | 26 |
| 8115 | `_resultadoDaRodada()` | 4 |
| 8119 | `_showScoreboard()` | 49 |
| 8168 | `_updateWeaponHud()` | 35 |
| 8203 | `_updateHud()` | 88 |
| 8291 | `update()` | 90 |
| 8381 | `dispose()` | 51 |

</details>

## Validação dos ponteiros escritos à mão

Nenhum ponteiro `arquivo:linha` da prosa aponta para fora do arquivo. ✓

<!-- END:GERADO -->


Gerado no gauntlet de 31/07. Use para saber ONDE mexer e ONDE **não** mexer.

## Índice de `public/js/game.js` (3234 linhas)

| Linhas | Bloco |
|---|---|
| 13–45 | `WEAPONS` — tabela de stats (dmg/mag/rate/reload/spreadHip/spreadScope/recoil/auto/scope/pellets/range) |
| 46–57 | constantes de partida/bot (`ROUND_TIME=99`, `ROUNDS_TO_WIN=3`, `RESPAWN_DELAY=2.5`, `SPAWN_PROT=3`, `BOT_SPEED=3.3`, `BOT_VIEW=45`) |
| 58–65 | `STATIC_CLASS` (arma → classe de VM) |
| 66–106 | `SNIPER_VM` / `RIFLE_VM` / `PISTOL_VM` / `SHOTGUN_VM` (variantes visuais) |
| 107–137 | `vmFovForAspect()` 111, `staticVmKey()` 117, `DED_VM` 127, `vmPreloadClasses()` 131 |
| 141 | `VM_SHRINK = 0.72` |
| 143–156 | `BOT_SKILLS` / `rollBotSkill()` |
| 157–431 | constructor — cena/câmera 172-176, `_buildEnv()` 180, bots 235-274, **rig de luz do VM 276-300**, pools de FX 305-363, `_adsPose` 364-376, `_vmMuzzle` 377-390, CTF 403-412 |
| 432–454 | `_dom()` (refs do HUD) — **ZONA VERMELHA, append-only** |
| 455–473 | `_buildEnv()` — IBL/env map (gradiente → PMREM) |
| 474–882 | `_buildViewModels()` — mãos, `fixVmMaterials` 622, braços GLB 662-683, `_buildStaticVmClass` 692-856 (materiais 716-750, **`VM_FWD` 754-785**, gun-space/muzzle 786-832, attachments 834-855) |
| 883–925 | texturas de FX (`_makePuffTexture`, `_makeFlashTex`, `_makeFlashCoreTex`) |
| 926–1059 | input (teclado/mouse/sensibilidade/rádio) |
| 1060–1208 | rounds / spawn / placar (`_startRound` 1064, `_resetPositions` 1077, rack 1120-1148, `_endRound` 1154, `_endMatch` 1177) |
| 1259–1290 | `setPaused`/`applySettings`/**`_applyQuality()` 1276**/`onResize` |
| 1291–1396 | troca de time + lazy-load de VM (`_applyVmVisibility` 1335, `_ensureStaticVm` 1350) |
| 1397–1447 | `_switchWeapon` 1397, **`_scope()` 1412**, **`_zoomFov()` 1429**, `_startReload` 1438 |
| 1448–1505 | **`_tryShoot()`** (bloom de spread 1467, spread 1468, kick 1481-1487, flash 1489), `_meleeHit` 1494 |
| 1506–1537 | `_fireHitscan()` — raycast + headshot (1527) |
| 1538–1609 | `_damage()` 1538, `_kill()` 1573 |
| 1610–1743 | HUD de combate: `_hitmarker()` 1619, `_dmgNumber()` 1634, `_feed()` 1654, `_wpnIcon` 1680 |
| 1744–1840 | `_tracer()` 1744, `_puff()` 1766, **`_flash()` 1783**, `_muzzleWorld()` 1832 |
| 1841–1922 | `_updateFx()` 1851, `_ejectCasing()` 1906 |
| 1923–2085 | granadas / fumaça |
| 2113–2317 | CTF (`_initCTF` 2113, `_updateCTF` 2159, **`_findPathLocal()` A\* 2225**, `_botCtf` 2247) |
| 2318–2333 | `_collide()` |
| 2334–2512 | **`_updatePlayer()`** — crouch 2345, velmax 2349, accel 2357, atrito 2367, pulo 2379, gravidade 2381, olho 2408, **FOV/ADS 2422-2432**, crosshair 2436, kick/bob/sway 2461-2492, IK 2495 |
| 2513–2612 | pickups / loadout |
| 2613–2644 | respawn / LOS |
| 2645–3034 | **`_updateBot()`** — percepção 2679-2712, combate 2726-2830 (mira 2729, juke 2740, flanco 2770, granada 2783, **chance de acerto 2799**, dano 2814), CTF 2831, roam+A\* 2836-2960, stuck 2975 |
| 3035–3100 | radar |
| 3101–3165 | `_showScoreboard` 3113, **`_updateHud()` 3132** |
| 3166–3204 | **`update(dt)`** — loop principal — **ZONA VERMELHA, append-only** |

## Levers por frente

### GRÁFICOS
- renderer / tonemapping / exposição / sombras: `main.js:26–31` (ACESFilmic, exposure 1.06, PCFSoft)
- bloom + composite (AgX, CA, vinheta, grain): `main.js:33–40` → `bloom.js:14–118` (`COMPOSITE`), `bloom.js:119` (`enableLightBloom`)
- stylize/cel (`?style=1`): `stylize.js:49`
- qualidade (pixelRatio 2/1/0.75, sombras): `game.js:1276` (`_applyQuality`) — **duplicado** com `main.js:26–41`
- IBL/env map: `game.js:455–473` (`_buildEnv`, gradiente 16×128 hardcoded 460-463); VM usa em `game.js:275`
- rig de luz do viewmodel: `game.js:276–300` (key 3.2 / fill 0.8 / rim 0.25 / bounce 1.6 / hemi 0.85)
- luz+fog+céu por mapa: `map.js:268–292`, `map_brasilia.js:264–290`, `map_pool_day.js:1240–1265`, `map_havan.js:413–420`, `map_ferrovelho.js:470–530`
- shadow map 2048² em câmera de 160×160 m = **12,8 cm/texel** (`map_brasilia.js:279` etc.)
- texturas procedurais do mundo: `textures.js:53` (`initTextures`), helpers 4-52
- materiais do VM (metalness/roughness/envMapIntensity): `game.js:716–750`

### ARMAS
- stats: `game.js:13–45`; classe: `game.js:60–65`; heróis: `DED_VM` `game.js:127`
- framing: `VM_FWD` `game.js:754–785`, `VM_SHRINK` `game.js:141`, `VM_GUNSPACE`/`gunBasis`/`buildVmAttachment` `vmattach.js:9/40/49`
- ADS: `_scope` `game.js:1412`, `_zoomFov` `game.js:1429`, `_adsPose` `game.js:364`, interpolação `game.js:2422–2492`
- tiro: `_tryShoot` `game.js:1448`; recoil `RecoilAxis` `springs.js:34` + instância `game.js:859` + recuperação `game.js:2405`
- muzzle: `_flash` `game.js:1783`, pools 330-357, `_vmMuzzle` 377-390; tracers `_tracer` 1744
- feedback: `_hitmarker` `game.js:1619`, `_dmgNumber` 1634, CSS `style.css:195–217`
- som: `audio.js:230` (`_gunshot`), `:319` (`shotWeapon`); chamadas `game.js:1466` e `:2825`
- braços/IK: `fparms.js:149/251`, `ARM_MOUNTS` `game.js:670`; armas no mundo: `weapons.js:31–62`

### UI / MENU
- roteamento: `main.js:117–124` (`show`)
- menu CS: `index.astro:165–241` + `style.css:351–397`
- setup (nick/armas/mapa/bots): `index.astro:183–235` + `main.js:396–508` + `style.css:55–106,398–404`
- times: `index.astro:244–267` + `main.js:783–805` + `style.css:131–147`
- personagens: `index.astro:270–284` + `main.js:219–280` + `style.css:150–164`
- settings/ranking/howto: `index.astro:287–347` + `main.js:724–866`
- **HUD**: `index.astro:349–408` + `game.js:432–454`/`:3132` + `style.css:174–312`
- paleta/tema: `style.css:7–21` (`:root`)

### JOGABILIDADE
- bots: `BOT_SKILLS`/`rollBotSkill` `game.js:146/151`, visão `:48`, reação `:2708`, cadência `:2794`, chance de acerto `:2799`, dano `:2814`
- movimento: maxSp `:2349` (6.6 sprint / 4.7 andar), accel `:2357` (92/23), atrito `:2367` (7/11), pulo `:2379` (vel.y 5.0), gravidade `:2381` (20.6), crouch `:2345`, olho `:2408` (1.62 / -0.52)
- sensibilidade: `game.js:999`
- spawn/rack/respawn: `:1077`, `:1120–1148`, `:2613`
- rounds: `:46`, `:1064`, `:1154`, `:1177`; CTF `:2113–2317` (CAP=3 em `:2160`)
- **BUG/alavanca morta**: `settings.difficulty` é gravado no menu (`main.js:503–508`) mas **nunca lido** — dificuldade é 100% aleatória via `rollBotSkill()`

## Tabela de CONFLITO — quem pode mexer em quê

| Arquivo | Dono no gauntlet | Observação |
|---|---|---|
| `main.js:24–44` (renderer/qualidade) | GRÁFICOS-CORE | UI não toca |
| `main.js:110–160, 396–560, 724–880` (menus) | UI | gráficos não toca |
| `bloom.js`, `stylize.js`, `textures.js` | GRÁFICOS-CORE | exclusivo |
| `map_brasilia.js` | MAPA-BRASILIA | exclusivo |
| `map_pool_day.js` | MAPA-POOL | exclusivo |
| `map_havan.js` | MAPA-HAVAN | exclusivo |
| `map_ferrovelho.js` | MAPA-FERRO | exclusivo |
| `map.js` | GRÁFICOS-CORE | mapa legado |
| `weapons.js`, `vmattach.js`, `springs.js`, `fparms.js` | ARMAS | exclusivo |
| `audio.js` | ARMAS (`_gunshot`/`shotWeapon`) | resto intocado |
| `style.css` linhas 1–172 e 315–460 | UI-MENU | fronteira na l.173 |
| `style.css` linhas 174–312 | UI-HUD | mesma pessoa que UI-MENU nesta rodada |
| `index.astro` 126–347 | UI-MENU | fronteira na l.348 |
| `index.astro` 349–408 | UI-HUD | idem |
| `glbchars.js`, `characters.js` | JOGABILIDADE | materiais de char = combinar antes |

### `game.js` — partição obrigatória (use **só** a ferramenta Edit, NUNCA Write)

| Ranges | Dono |
|---|---|
| 180, 275–300, 455–473, 716–750, 1276–1283 | GRÁFICOS-CORE |
| 13–45, 58–141, 364–390, 474–715, 751–882, 1397–1505, 1506–1537, 1744–1840, 1906–1922 | ARMAS |
| 46–57, 143–156, 199–274, 1060–1208, 2318–2512(**≤2409**), 2513–2644, 2645–3034 | JOGABILIDADE |
| 1538–1743, 3035–3165 | UI (HUD/feedback) |
| 432–454 e 3166–3204 | **ninguém reescreve** — só append de 1-2 linhas quando inevitável |

Zonas de atrito conhecidas: `_tryShoot` (armas+gráficos+áudio), `_updatePlayer` (cortar em 2409), `_buildViewModels:716–750` (materiais compartilhados), cluster `_damage/_kill/_hitmarker/_feed`.
