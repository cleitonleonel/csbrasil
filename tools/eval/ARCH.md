# ARCH.md — mapa de arquitetura e de CONFLITO (CS BRASIL / CORO SOLTO)

<!-- BEGIN:GERADO — não edite à mão, rode `npm run arch` -->

> Gerado por `node tools/gen-arch.mjs`. **Não edite este bloco à mão.**
> Versão do jogo: 2.1.0-alpha.76 · `npm run arch` para regenerar · `npm run arch:check` no CI.

## Tamanho dos arquivos indexados

| Arquivo | Linhas | Símbolos |
|---|---:|---:|
| `public/js/game.js` | 8402 | 329 |
| `public/js/main.js` | 4406 | 332 |
| `public/js/glbchars.js` | 855 | 60 |
| `public/js/characters.js` | 1143 | 42 |
| `public/js/vmattach.js` | 633 | 4 |
| `public/js/springs.js` | 260 | 28 |
| `public/js/weapons.js` | 354 | 22 |

## Maiores métodos de `game.js` — onde o conflito mora

Os 15 maiores somam **3329 linhas (40% do arquivo)**. Método grande = PR irrevisável e merge conflitante.

| Linhas | Início | Método | |
|---:|---:|---|---|
| 838 | 6987 | `_updateBot()` | ⚠️ candidato a extração |
| 629 | 694 | `constructor()` | 🔴 append-only |
| 304 | 6089 | `_updatePlayer()` | ⚠️ candidato a extração |
| 269 | 1423 | `_buildViewModels()` |  |
| 255 | 2615 | `_resetPositions()` |  |
| 158 | 6406 | `_updatePickups()` |  |
| 137 | 5323 | `_botCtf()` |  |
| 135 | 2175 | `_touchControls()` |  |
| 101 | 5988 | `_moveEntity()` |  |
| 90 | 8261 | `update()` | 🔴 append-only |
| 88 | 8173 | `_updateHud()` |  |
| 86 | 5034 | `_initCTF()` |  |
| 81 | 3607 | `_tryShoot()` |  |
| 79 | 3253 | `_ensureVmPrecisionQa()` |  |
| 79 | 4102 | `_dmgArc()` |  |

## Tabela de CONFLITO — resolvida para as linhas de hoje

Declare sua frente antes de editar. Em `game.js` use **só a ferramenta Edit, nunca Write**.
Duas frentes com faixas disjuntas podem rodar em paralelo — foi medido: 3 agentes editaram
faixas disjuntas simultaneamente com zero conflito de conteúdo.

| Frente | Faixas em `game.js` | Arquivos exclusivos |
|---|---|---|
| **ARMAS / VIEWMODEL** | `339–342` `424–518` `548–569` `1423–1832` `3219–3252` `3449–3542` `3561–3687` `3702–3717` `3762–3831` `4363–4388` `4436–4536` `4609–4625` | `public/js/vmattach.js` `public/js/springs.js` `public/js/weapons.js` `public/js/fparms.js` `public/js/handik.js` `public/js/recoil.js` `public/js/vmlab.js` |
| **BOTS / JOGABILIDADE** | `178–181` `232–232` `258–269` `611–622` `3971–4071` `4973–5033` `5205–5459` `5542–5564` `6089–6392` `6789–6806` `6935–6965` `6987–7824` | — |
| **MAPAS / MUNDO** | `1369–1422` `2615–2869` `5034–5180` `6406–6563` | `public/js/maps.js` `public/js/mapprops.js` `public/js/map_brasilia.js` `public/js/map_havan.js` `public/js/map_piscina.js` `public/js/map_piscinao_ramos.js` `public/js/map_ferrovelho.js` |
| **GRÁFICOS / FX** | `1847–1856` `1971–2009` `3122–3135` `4389–4427` `4552–4608` | `public/js/bloom.js` `public/js/textures.js` `public/js/vao.js` `public/js/stylize.js` `public/js/gpuparticles.js` |
| **UI / HUD / MENU** | `1323–1368` `3074–3096` `3112–3121` `3136–3152` `4102–4180` `4230–4283` `4299–4362` `7995–8058` `8089–8137` `8173–8260` | `public/js/main.js` `public/style.css` `src/pages/index.astro` |
| **ÁUDIO** | — | `public/js/audio.js` |
| **PERSONAGENS** | — | `public/js/characters.js` `public/js/glbchars.js` |
| **SITE / BACKEND** | — | `src/` `supabase/` |

**🔴 Zonas vermelhas (append-only, qualquer frente pode precisar):** `update()` 8261–8350 · `_dom()` 1323–1368 · `constructor()` 694–1322

Nenhuma sobreposição entre frentes — todas as faixas são disjuntas. ✓

Cobertura: **3902 de 8402 linhas (46%)** do `game.js` têm dono declarado. O resto é território neutro — declare a frente mesmo assim.

<details><summary><strong>Índice completo de <code>game.js</code> (todos os símbolos)</strong></summary>

| Linha | Símbolo | Linhas |
|---:|---|---:|
| 49 | `ANNOUNCER_LAB` | 4 |
| 53 | `VMLAB` | 3 |
| 58 | `VM_QA_CICLO` | 3 |
| 62 | `VM_QA_ADS` | 8 |
| 70 | `VM_MAT_LEGACY` | 4 |
| 76 | `DROP_TTL` | 8 |
| 84 | `ROUNDS_MAX` | 27 |
| 114 | `CTF_CLOCK_SHOW` | 4 |
| 118 | `KILLS_PER_PLAYER` | 7 |
| 125 | `PACE` | 33 |
| 158 | `PAUSE_ARM_MS` | 3 |
| 161 | `CHAT_PAUSA_GUARDA_MS` | 9 |
| 171 | `confirmGate` | 7 |
| 182 | `BOT_AIM_PITCH` | 4 |
| 186 | `BOT_DMG_PLAYER` | 21 |
| 207 | `BOT_FAIR` | 5 |
| 212 | `BOT_MOVE2` | 15 |
| 236 | `BOT_FOCUS_MIN` | 22 |
| 262 | `BOT_TOKEN_REST` | 7 |
| 270 | `MOVE_MUL` | 6 |
| 277 | `MOVE2` | 4 |
| 281 | `STEP_H` | 3 |
| 288 | `MANTLE_APOIO` | 4 |
| 292 | `MANTLE_GRID` | 5 |
| 297 | `RACK_OLD` | 4 |
| 301 | `RACK_RETA` | 25 |
| 328 | `RADIO` | 5 |
| 334 | `MK_LABELS` | 5 |
| 339 | `GUNFEEL` | 4 |
| 346 | `TRACER_STYLE` | 6 |
| 356 | `ADS_RAMPA_S` | 3 |
| 360 | `aberturaCone` | 16 |
| 376 | `anguloDeDisparo` | 4 |
| 380 | `coneDoDisparo` | 16 |
| 397 | `D2R` | 4 |
| 401 | `DMG_FALLOFF` | 5 |
| 406 | `HS_MUL` | 3 |
| 409 | `BALL_CLASS` | 15 |
| 424 | `STATIC_CLASS` | 75 |
| 500 | `VM_KNOB` | 19 |
| 519 | `vmAdsRot` | 4 |
| 524 | `vmFovForAspect` | 24 |
| 548 | `VM_OFF` | 22 |
| 570 | `vmOffY` | 35 |
| 605 | `VMP` | 6 |
| 611 | `BOT_SKILLS` | 11 |
| 623 | `diffKey` | 4 |
| 628 | `rollBotSkill` | 7 |
| 635 | `botTier` | 4 |
| 639 | `_cyclePool` | 5 |
| 644 | `_rosterPool` | 16 |
| 661 | `pickMatchRoster` | 16 |
| 677 | `BOT_WEAPON_POOL` | 5 |
| 682 | `pickMatchWeapons` | 9 |
| 694 | `constructor()` | 629 |
| 1323 | `_dom()` | 46 |
| 1369 | `_buildEnv()` | 54 |
| 1423 | `_buildViewModels()` | 269 |
| 1692 | `_vmFrame` | 141 |
| 1833 | `_vmMontarTardio` | 14 |
| 1847 | `_makePuffTexture()` | 10 |
| 1857 | `_makeBloodTex()` | 19 |
| 1876 | `_makeBloodPoolTex()` | 21 |
| 1897 | `_bloodDecal()` | 16 |
| 1913 | `_makeBloodFx()` | 20 |
| 1933 | `_bloodSpatter()` | 18 |
| 1951 | `_bloodPoolAt()` | 6 |
| 1957 | `_updateBlood()` | 14 |
| 1971 | `_makeFlashTex()` | 21 |
| 1992 | `_makeFlashSoftTex()` | 8 |
| 2000 | `_makeFlashCoreTex()` | 10 |
| 2010 | `_input()` | 6 |
| 2016 | `_kd` | 49 |
| 2065 | `_ku` | 5 |
| 2070 | `_md` | 40 |
| 2110 | `_mu` | 7 |
| 2117 | `_mm` | 20 |
| 2137 | `_wh` | 17 |
| 2154 | `_cc` | 1 |
| 2155 | `_blur` | 1 |
| 2156 | `_plc` | 19 |
| 2175 | `_touchControls()` | 135 |
| 2310 | `_aimAssist()` | 28 |
| 2338 | `_requestLock()` | 27 |
| 2365 | `_travaAtalhos()` | 4 |
| 2369 | `_soltaAtalhos()` | 5 |
| 2374 | `espectando()` | 2 |
| 2376 | `_acceptInput()` | 7 |
| 2383 | `travarEntrada()` | 17 |
| 2400 | `_chatSeguraPausa()` | 5 |
| 2405 | `_pauseBackdrop()` | 7 |
| 2412 | `_radioShow()` | 6 |
| 2418 | `_radioUi()` | 8 |
| 2426 | `_radioPick()` | 20 |
| 2446 | `_abilityNotice()` | 10 |
| 2456 | `_resetSliceAbilities()` | 9 |
| 2465 | `_stackTrace()` | 28 |
| 2493 | `_updateMotocaCharge()` | 10 |
| 2503 | `_recordRoutePoint()` | 11 |
| 2514 | `_routePing()` | 23 |
| 2537 | `_tickRoutePings()` | 12 |
| 2549 | `_objectiveInteractionMultiplier()` | 14 |
| 2563 | `start()` | 5 |
| 2568 | `_startAnnouncerLab()` | 9 |
| 2577 | `_startRound()` | 38 |
| 2615 | `_resetPositions()` | 255 |
| 2870 | `_checkCtfAlvo()` | 13 |
| 2883 | `_checkPace()` | 13 |
| 2896 | `_endRound()` | 34 |
| 2930 | `_roundWinnerVoice()` | 12 |
| 2942 | `_fimDaPartida()` | 7 |
| 2949 | `_endMatch()` | 61 |
| 3010 | `_ensureDolly()` | 41 |
| 3051 | `_tickDolly()` | 23 |
| 3074 | `setPaused()` | 23 |
| 3097 | `_now()` | 3 |
| 3100 | `pauseArmed()` | 1 |
| 3101 | `_syncPauseArm()` | 7 |
| 3108 | `resume()` | 4 |
| 3112 | `applySettings()` | 10 |
| 3122 | `_applyQuality()` | 14 |
| 3136 | `onResize()` | 17 |
| 3153 | `_switchTeam()` | 66 |
| 3219 | `_applyVmVisibility()` | 34 |
| 3253 | `_ensureVmPrecisionQa()` | 79 |
| 3332 | `_syncVmPresentation()` | 19 |
| 3351 | `_vmlabEnsure()` | 14 |
| 3365 | `_vmlabFrame()` | 28 |
| 3393 | `_tuneGet()` | 15 |
| 3408 | `_tune()` | 23 |
| 3431 | `_fxSet()` | 2 |
| 3433 | `_qaCicloArma()` | 8 |
| 3441 | `_cycleWeapon()` | 8 |
| 3449 | `_switchWeapon()` | 39 |
| 3488 | `_deploySfx()` | 7 |
| 3495 | `_scope()` | 17 |
| 3512 | `_zoomFov()` | 5 |
| 3517 | `_reloading()` | 1 |
| 3518 | `_startReload()` | 25 |
| 3543 | `_reloadLayers()` | 18 |
| 3561 | `_installRecoil()` | 33 |
| 3594 | `_shotRecoil()` | 13 |
| 3607 | `_tryShoot()` | 81 |
| 3688 | `_tryKnifeAttack()` | 14 |
| 3702 | `_meleeHit()` | 16 |
| 3718 | `_meleeRange()` | 5 |
| 3723 | `_botMelee()` | 28 |
| 3751 | `_shotDamage()` | 11 |
| 3762 | `_fireHitscan()` | 70 |
| 3832 | `_targetFromHit()` | 9 |
| 3841 | `_penetrationExit()` | 20 |
| 3861 | `_surfaceOf()` | 27 |
| 3888 | `_armoredTarget()` | 3 |
| 3891 | `_fleshImpact()` | 38 |
| 3929 | `_fxVoice()` | 9 |
| 3938 | `_impactSfx()` | 17 |
| 3955 | `_tintFx()` | 16 |
| 3971 | `_damage()` | 42 |
| 4013 | `_playerHurtFx()` | 6 |
| 4019 | `_kill()` | 53 |
| 4072 | `_checkArenaWin()` | 30 |
| 4102 | `_dmgArc()` | 79 |
| 4181 | `_mkBanner()` | 9 |
| 4190 | `_updateKillSequenceHud()` | 12 |
| 4202 | `_resetKillSequence()` | 5 |
| 4207 | `_playerKillFeedback()` | 18 |
| 4225 | `_acertoPrevisto()` | 5 |
| 4230 | `_hitmarker()` | 15 |
| 4245 | `_dmgNumber()` | 20 |
| 4265 | `_feed()` | 19 |
| 4284 | `_skullIcon()` | 6 |
| 4290 | `_killfeedWeaponIcon()` | 9 |
| 4299 | `_wpnIcon()` | 64 |
| 4363 | `_tracer()` | 26 |
| 4389 | `_puff()` | 39 |
| 4428 | `_holeDecalMat()` | 8 |
| 4436 | `_flash()` | 61 |
| 4497 | `_vmTetoTela()` | 10 |
| 4507 | `_muzzleWorld()` | 30 |
| 4537 | `_aimOrigin()` | 5 |
| 4542 | `_updateDoors()` | 10 |
| 4552 | `_updateFx()` | 57 |
| 4609 | `_ejectCasing()` | 17 |
| 4626 | `_makeCtfFlagTex()` | 23 |
| 4649 | `_paintFlagSymbol()` | 9 |
| 4658 | `_flagTexFor()` | 26 |
| 4684 | `_legadoSimbolo()` | 8 |
| 4692 | `_loadCtfSymbols()` | 22 |
| 4714 | `_makeCtfZoneTex()` | 31 |
| 4745 | `_makeSmokeTex()` | 10 |
| 4755 | `_updateSmokeHud()` | 4 |
| 4759 | `_grenadeSpatial()` | 14 |
| 4773 | `_spawnGrenade()` | 19 |
| 4792 | `_throwNade()` | 13 |
| 4805 | `_throwSmoke()` | 1 |
| 4806 | `_throwFrag()` | 4 |
| 4810 | `_explodeFrag()` | 40 |
| 4850 | `_corDaFumaca()` | 16 |
| 4866 | `_popSmoke()` | 23 |
| 4889 | `_updateGrenades()` | 35 |
| 4924 | `_teamColor()` | 15 |
| 4939 | `_teamInk()` | 7 |
| 4946 | `_factionOf()` | 1 |
| 4947 | `_voiceKey()` | 1 |
| 4948 | `_teamName()` | 1 |
| 4949 | `_teamTag()` | 6 |
| 4955 | `_plaqueta()` | 13 |
| 4968 | `_mirror()` | 2 |
| 4970 | `_defNoLado()` | 3 |
| 4973 | `_botSeparation()` | 61 |
| 5034 | `_initCTF()` | 86 |
| 5120 | `_updateCTF()` | 61 |
| 5181 | `_ctfWin()` | 24 |
| 5205 | `_freeYaw()` | 25 |
| 5230 | `_pullString()` | 23 |
| 5253 | `_walkReach()` | 32 |
| 5285 | `_wpComp()` | 16 |
| 5301 | `_findPathLocal()` | 22 |
| 5323 | `_botCtf()` | 137 |
| 5460 | `_hideCtfHud()` | 6 |
| 5466 | `_updateCtfHud()` | 76 |
| 5542 | `_collide()` | 23 |
| 5565 | `_collideRot()` | 22 |
| 5587 | `_mantleAlcance()` | 50 |
| 5637 | `_mantleAlcancavel()` | 12 |
| 5649 | `_mantleTarget()` | 35 |
| 5684 | `_freeSpot()` | 30 |
| 5714 | `_retaAndavel()` | 20 |
| 5734 | `_walkDepth()` | 16 |
| 5750 | `_noteHit()` | 17 |
| 5767 | `_deathFeedback()` | 45 |
| 5812 | `_toggleCamView()` | 6 |
| 5818 | `setCamView()` | 16 |
| 5834 | `_syncCamViewVis()` | 8 |
| 5842 | `_ensurePlayerTP()` | 26 |
| 5868 | `_updatePlayerTP()` | 42 |
| 5910 | `_updateCrosshairParallax()` | 47 |
| 5957 | `_tpDeath()` | 18 |
| 5975 | `_tpRevive()` | 13 |
| 5988 | `_moveEntity()` | 101 |
| 6089 | `_updatePlayer()` | 304 |
| 6393 | `_footstepSurface()` | 13 |
| 6406 | `_updatePickups()` | 158 |
| 6564 | `_wpnMode()` | 5 |
| 6569 | `_botWeapon()` | 10 |
| 6579 | `_municaoInfinita()` | 1 |
| 6580 | `_pickupAllowed()` | 9 |
| 6589 | `_grabNearPickup()` | 10 |
| 6599 | `_grabPickup()` | 35 |
| 6634 | `_assentarNoChao()` | 10 |
| 6644 | `refreshPickupModels()` | 24 |
| 6668 | `_dropWeapon()` | 20 |
| 6688 | `_sumirDrop()` | 36 |
| 6724 | `_spawnY()` | 3 |
| 6727 | `_spawnYaw()` | 5 |
| 6732 | `_pickSpawn()` | 23 |
| 6755 | `_respawnPlayer()` | 34 |
| 6789 | `_losClear()` | 18 |
| 6807 | `_botCall()` | 41 |
| 6848 | `_teamMarkTex()` | 23 |
| 6871 | `_makeTeamMark()` | 16 |
| 6887 | `_trocarPersonagem()` | 18 |
| 6905 | `_syncRemoteWeapon()` | 23 |
| 6928 | `_updateTeamMark()` | 7 |
| 6935 | `_botEye()` | 1 |
| 6936 | `_enemyOf()` | 8 |
| 6944 | `_duelToken()` | 22 |
| 6966 | `_respawnEntity()` | 21 |
| 6987 | `_updateBot()` | 838 |
| 7825 | `_flushTraining()` | 13 |
| 7838 | `_updateBotNN()` | 73 |
| 7911 | `_botShootNN()` | 46 |
| 7957 | `_radarFoot()` | 38 |
| 7995 | `_updateRadar()` | 64 |
| 8059 | `_banner()` | 26 |
| 8085 | `_resultadoDaRodada()` | 4 |
| 8089 | `_showScoreboard()` | 49 |
| 8138 | `_updateWeaponHud()` | 35 |
| 8173 | `_updateHud()` | 88 |
| 8261 | `update()` | 90 |
| 8351 | `dispose()` | 51 |

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
