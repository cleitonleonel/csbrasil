# ARCH.md — mapa de arquitetura e de CONFLITO (CS BRASIL / CORO SOLTO)

<!-- BEGIN:GERADO — não edite à mão, rode `npm run arch` -->

> Gerado por `node tools/gen-arch.mjs`. **Não edite este bloco à mão.**
> Versão do jogo: 2.1.0-alpha.77 · `npm run arch` para regenerar · `npm run arch:check` no CI.

## Tamanho dos arquivos indexados

| Arquivo | Linhas | Símbolos |
|---|---:|---:|
| `public/js/game.js` | 8459 | 335 |
| `public/js/main.js` | 4403 | 332 |
| `public/js/glbchars.js` | 855 | 60 |
| `public/js/characters.js` | 1143 | 42 |
| `public/js/vmattach.js` | 633 | 4 |
| `public/js/springs.js` | 260 | 28 |
| `public/js/weapons.js` | 354 | 22 |

## Maiores métodos de `game.js` — onde o conflito mora

Os 15 maiores somam **3354 linhas (40% do arquivo)**. Método grande = PR irrevisável e merge conflitante.

| Linhas | Início | Método | |
|---:|---:|---|---|
| 858 | 7024 | `_updateBot()` | ⚠️ candidato a extração |
| 629 | 712 | `constructor()` | 🔴 append-only |
| 308 | 6107 | `_updatePlayer()` | ⚠️ candidato a extração |
| 269 | 1441 | `_buildViewModels()` |  |
| 255 | 2633 | `_resetPositions()` |  |
| 158 | 6428 | `_updatePickups()` |  |
| 137 | 5341 | `_botCtf()` |  |
| 135 | 2193 | `_touchControls()` |  |
| 101 | 6006 | `_moveEntity()` |  |
| 90 | 8318 | `update()` | 🔴 append-only |
| 88 | 8230 | `_updateHud()` |  |
| 86 | 5052 | `_initCTF()` |  |
| 82 | 3624 | `_tryShoot()` |  |
| 79 | 3270 | `_ensureVmPrecisionQa()` |  |
| 79 | 4120 | `_dmgArc()` |  |

## Tabela de CONFLITO — resolvida para as linhas de hoje

Declare sua frente antes de editar. Em `game.js` use **só a ferramenta Edit, nunca Write**.
Duas frentes com faixas disjuntas podem rodar em paralelo — foi medido: 3 agentes editaram
faixas disjuntas simultaneamente com zero conflito de conteúdo.

| Frente | Faixas em `game.js` | Arquivos exclusivos |
|---|---|---|
| **ARMAS / VIEWMODEL** | `357–360` `442–536` `566–587` `1441–1850` `3236–3269` `3466–3559` `3578–3705` `3720–3735` `3780–3849` `4381–4406` `4454–4554` `4627–4643` | `public/js/vmattach.js` `public/js/springs.js` `public/js/weapons.js` `public/js/fparms.js` `public/js/handik.js` `public/js/recoil.js` `public/js/vmlab.js` |
| **BOTS / JOGABILIDADE** | `177–180` `231–231` `276–287` `629–640` `3989–4089` `4991–5051` `5223–5477` `5560–5582` `6107–6414` `6811–6828` `6957–6987` `7024–7881` | — |
| **MAPAS / MUNDO** | `1387–1440` `2633–2887` `5052–5198` `6428–6585` | `public/js/maps.js` `public/js/mapprops.js` `public/js/map_brasilia.js` `public/js/map_havan.js` `public/js/map_piscina.js` `public/js/map_piscinao_ramos.js` `public/js/map_ferrovelho.js` |
| **GRÁFICOS / FX** | `1865–1874` `1989–2027` `3140–3152` `4407–4445` `4570–4626` | `public/js/bloom.js` `public/js/textures.js` `public/js/vao.js` `public/js/stylize.js` `public/js/gpuparticles.js` |
| **UI / HUD / MENU** | `1341–1386` `3092–3114` `3130–3139` `3153–3169` `4120–4198` `4248–4301` `4317–4380` `8052–8115` `8146–8194` `8230–8317` | `public/js/main.js` `public/style.css` `src/pages/index.astro` |
| **ÁUDIO** | — | `public/js/audio.js` |
| **PERSONAGENS** | — | `public/js/characters.js` `public/js/glbchars.js` |
| **SITE / BACKEND** | — | `src/` `supabase/` |

**🔴 Zonas vermelhas (append-only, qualquer frente pode precisar):** `update()` 8318–8407 · `_dom()` 1341–1386 · `constructor()` 712–1340

Nenhuma sobreposição entre frentes — todas as faixas são disjuntas. ✓

Cobertura: **3926 de 8459 linhas (46%)** do `game.js` têm dono declarado. O resto é território neutro — declare a frente mesmo assim.

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
| 113 | `CTF_CLOCK_SHOW` | 4 |
| 117 | `KILLS_PER_PLAYER` | 7 |
| 124 | `PACE` | 33 |
| 157 | `PAUSE_ARM_MS` | 3 |
| 160 | `CHAT_PAUSA_GUARDA_MS` | 9 |
| 170 | `confirmGate` | 7 |
| 181 | `BOT_AIM_PITCH` | 4 |
| 185 | `BOT_DMG_PLAYER` | 21 |
| 206 | `BOT_FAIR` | 5 |
| 211 | `BOT_MOVE2` | 15 |
| 235 | `BOT_FOCUS_MIN` | 15 |
| 254 | `BOT_OUVE_PASSO` | 22 |
| 280 | `BOT_TOKEN_REST` | 7 |
| 288 | `MOVE_MUL` | 6 |
| 295 | `MOVE2` | 4 |
| 299 | `STEP_H` | 3 |
| 306 | `MANTLE_APOIO` | 4 |
| 310 | `MANTLE_GRID` | 5 |
| 315 | `RACK_OLD` | 4 |
| 319 | `RACK_RETA` | 25 |
| 346 | `RADIO` | 5 |
| 352 | `MK_LABELS` | 5 |
| 357 | `GUNFEEL` | 4 |
| 364 | `TRACER_STYLE` | 6 |
| 374 | `ADS_RAMPA_S` | 3 |
| 378 | `aberturaCone` | 16 |
| 394 | `anguloDeDisparo` | 4 |
| 398 | `coneDoDisparo` | 16 |
| 415 | `D2R` | 4 |
| 419 | `DMG_FALLOFF` | 5 |
| 424 | `HS_MUL` | 3 |
| 427 | `BALL_CLASS` | 15 |
| 442 | `STATIC_CLASS` | 75 |
| 518 | `VM_KNOB` | 19 |
| 537 | `vmAdsRot` | 4 |
| 542 | `vmFovForAspect` | 24 |
| 566 | `VM_OFF` | 22 |
| 588 | `vmOffY` | 35 |
| 623 | `VMP` | 6 |
| 629 | `BOT_SKILLS` | 11 |
| 641 | `diffKey` | 4 |
| 646 | `rollBotSkill` | 7 |
| 653 | `botTier` | 4 |
| 657 | `_cyclePool` | 5 |
| 662 | `_rosterPool` | 16 |
| 679 | `pickMatchRoster` | 16 |
| 695 | `BOT_WEAPON_POOL` | 5 |
| 700 | `pickMatchWeapons` | 9 |
| 712 | `constructor()` | 629 |
| 1341 | `_dom()` | 46 |
| 1387 | `_buildEnv()` | 54 |
| 1441 | `_buildViewModels()` | 269 |
| 1710 | `_vmFrame` | 141 |
| 1851 | `_vmMontarTardio` | 14 |
| 1865 | `_makePuffTexture()` | 10 |
| 1875 | `_makeBloodTex()` | 19 |
| 1894 | `_makeBloodPoolTex()` | 21 |
| 1915 | `_bloodDecal()` | 16 |
| 1931 | `_makeBloodFx()` | 20 |
| 1951 | `_bloodSpatter()` | 18 |
| 1969 | `_bloodPoolAt()` | 6 |
| 1975 | `_updateBlood()` | 14 |
| 1989 | `_makeFlashTex()` | 21 |
| 2010 | `_makeFlashSoftTex()` | 8 |
| 2018 | `_makeFlashCoreTex()` | 10 |
| 2028 | `_input()` | 6 |
| 2034 | `_kd` | 49 |
| 2083 | `_ku` | 5 |
| 2088 | `_md` | 40 |
| 2128 | `_mu` | 7 |
| 2135 | `_mm` | 20 |
| 2155 | `_wh` | 17 |
| 2172 | `_cc` | 1 |
| 2173 | `_blur` | 1 |
| 2174 | `_plc` | 19 |
| 2193 | `_touchControls()` | 135 |
| 2328 | `_aimAssist()` | 28 |
| 2356 | `_requestLock()` | 27 |
| 2383 | `_travaAtalhos()` | 4 |
| 2387 | `_soltaAtalhos()` | 5 |
| 2392 | `espectando()` | 2 |
| 2394 | `_acceptInput()` | 7 |
| 2401 | `travarEntrada()` | 17 |
| 2418 | `_chatSeguraPausa()` | 5 |
| 2423 | `_pauseBackdrop()` | 7 |
| 2430 | `_radioShow()` | 6 |
| 2436 | `_radioUi()` | 8 |
| 2444 | `_radioPick()` | 20 |
| 2464 | `_abilityNotice()` | 10 |
| 2474 | `_resetSliceAbilities()` | 9 |
| 2483 | `_stackTrace()` | 28 |
| 2511 | `_updateMotocaCharge()` | 10 |
| 2521 | `_recordRoutePoint()` | 11 |
| 2532 | `_routePing()` | 23 |
| 2555 | `_tickRoutePings()` | 12 |
| 2567 | `_objectiveInteractionMultiplier()` | 14 |
| 2581 | `start()` | 5 |
| 2586 | `_startAnnouncerLab()` | 9 |
| 2595 | `_startRound()` | 38 |
| 2633 | `_resetPositions()` | 255 |
| 2888 | `_checkCtfAlvo()` | 13 |
| 2901 | `_checkPace()` | 13 |
| 2914 | `_endRound()` | 34 |
| 2948 | `_roundWinnerVoice()` | 12 |
| 2960 | `_fimDaPartida()` | 7 |
| 2967 | `_endMatch()` | 61 |
| 3028 | `_ensureDolly()` | 41 |
| 3069 | `_tickDolly()` | 23 |
| 3092 | `setPaused()` | 23 |
| 3115 | `_now()` | 3 |
| 3118 | `pauseArmed()` | 1 |
| 3119 | `_syncPauseArm()` | 7 |
| 3126 | `resume()` | 4 |
| 3130 | `applySettings()` | 10 |
| 3140 | `_applyQuality()` | 13 |
| 3153 | `onResize()` | 17 |
| 3170 | `_switchTeam()` | 66 |
| 3236 | `_applyVmVisibility()` | 34 |
| 3270 | `_ensureVmPrecisionQa()` | 79 |
| 3349 | `_syncVmPresentation()` | 19 |
| 3368 | `_vmlabEnsure()` | 14 |
| 3382 | `_vmlabFrame()` | 28 |
| 3410 | `_tuneGet()` | 15 |
| 3425 | `_tune()` | 23 |
| 3448 | `_fxSet()` | 2 |
| 3450 | `_qaCicloArma()` | 8 |
| 3458 | `_cycleWeapon()` | 8 |
| 3466 | `_switchWeapon()` | 39 |
| 3505 | `_deploySfx()` | 7 |
| 3512 | `_scope()` | 17 |
| 3529 | `_zoomFov()` | 5 |
| 3534 | `_reloading()` | 1 |
| 3535 | `_startReload()` | 25 |
| 3560 | `_reloadLayers()` | 18 |
| 3578 | `_installRecoil()` | 33 |
| 3611 | `_shotRecoil()` | 13 |
| 3624 | `_tryShoot()` | 82 |
| 3706 | `_tryKnifeAttack()` | 14 |
| 3720 | `_meleeHit()` | 16 |
| 3736 | `_meleeRange()` | 5 |
| 3741 | `_botMelee()` | 28 |
| 3769 | `_shotDamage()` | 11 |
| 3780 | `_fireHitscan()` | 70 |
| 3850 | `_targetFromHit()` | 9 |
| 3859 | `_penetrationExit()` | 20 |
| 3879 | `_surfaceOf()` | 27 |
| 3906 | `_armoredTarget()` | 3 |
| 3909 | `_fleshImpact()` | 38 |
| 3947 | `_fxVoice()` | 9 |
| 3956 | `_impactSfx()` | 17 |
| 3973 | `_tintFx()` | 16 |
| 3989 | `_damage()` | 42 |
| 4031 | `_playerHurtFx()` | 6 |
| 4037 | `_kill()` | 53 |
| 4090 | `_checkArenaWin()` | 30 |
| 4120 | `_dmgArc()` | 79 |
| 4199 | `_mkBanner()` | 9 |
| 4208 | `_updateKillSequenceHud()` | 12 |
| 4220 | `_resetKillSequence()` | 5 |
| 4225 | `_playerKillFeedback()` | 18 |
| 4243 | `_acertoPrevisto()` | 5 |
| 4248 | `_hitmarker()` | 15 |
| 4263 | `_dmgNumber()` | 20 |
| 4283 | `_feed()` | 19 |
| 4302 | `_skullIcon()` | 6 |
| 4308 | `_killfeedWeaponIcon()` | 9 |
| 4317 | `_wpnIcon()` | 64 |
| 4381 | `_tracer()` | 26 |
| 4407 | `_puff()` | 39 |
| 4446 | `_holeDecalMat()` | 8 |
| 4454 | `_flash()` | 61 |
| 4515 | `_vmTetoTela()` | 10 |
| 4525 | `_muzzleWorld()` | 30 |
| 4555 | `_aimOrigin()` | 5 |
| 4560 | `_updateDoors()` | 10 |
| 4570 | `_updateFx()` | 57 |
| 4627 | `_ejectCasing()` | 17 |
| 4644 | `_makeCtfFlagTex()` | 23 |
| 4667 | `_paintFlagSymbol()` | 9 |
| 4676 | `_flagTexFor()` | 26 |
| 4702 | `_legadoSimbolo()` | 8 |
| 4710 | `_loadCtfSymbols()` | 22 |
| 4732 | `_makeCtfZoneTex()` | 31 |
| 4763 | `_makeSmokeTex()` | 10 |
| 4773 | `_updateSmokeHud()` | 4 |
| 4777 | `_grenadeSpatial()` | 14 |
| 4791 | `_spawnGrenade()` | 19 |
| 4810 | `_throwNade()` | 13 |
| 4823 | `_throwSmoke()` | 1 |
| 4824 | `_throwFrag()` | 4 |
| 4828 | `_explodeFrag()` | 40 |
| 4868 | `_corDaFumaca()` | 16 |
| 4884 | `_popSmoke()` | 23 |
| 4907 | `_updateGrenades()` | 35 |
| 4942 | `_teamColor()` | 15 |
| 4957 | `_teamInk()` | 7 |
| 4964 | `_factionOf()` | 1 |
| 4965 | `_voiceKey()` | 1 |
| 4966 | `_teamName()` | 1 |
| 4967 | `_teamTag()` | 6 |
| 4973 | `_plaqueta()` | 13 |
| 4986 | `_mirror()` | 2 |
| 4988 | `_defNoLado()` | 3 |
| 4991 | `_botSeparation()` | 61 |
| 5052 | `_initCTF()` | 86 |
| 5138 | `_updateCTF()` | 61 |
| 5199 | `_ctfWin()` | 24 |
| 5223 | `_freeYaw()` | 25 |
| 5248 | `_pullString()` | 23 |
| 5271 | `_walkReach()` | 32 |
| 5303 | `_wpComp()` | 16 |
| 5319 | `_findPathLocal()` | 22 |
| 5341 | `_botCtf()` | 137 |
| 5478 | `_hideCtfHud()` | 6 |
| 5484 | `_updateCtfHud()` | 76 |
| 5560 | `_collide()` | 23 |
| 5583 | `_collideRot()` | 22 |
| 5605 | `_mantleAlcance()` | 50 |
| 5655 | `_mantleAlcancavel()` | 12 |
| 5667 | `_mantleTarget()` | 35 |
| 5702 | `_freeSpot()` | 30 |
| 5732 | `_retaAndavel()` | 20 |
| 5752 | `_walkDepth()` | 16 |
| 5768 | `_noteHit()` | 17 |
| 5785 | `_deathFeedback()` | 45 |
| 5830 | `_toggleCamView()` | 6 |
| 5836 | `setCamView()` | 16 |
| 5852 | `_syncCamViewVis()` | 8 |
| 5860 | `_ensurePlayerTP()` | 26 |
| 5886 | `_updatePlayerTP()` | 42 |
| 5928 | `_updateCrosshairParallax()` | 47 |
| 5975 | `_tpDeath()` | 18 |
| 5993 | `_tpRevive()` | 13 |
| 6006 | `_moveEntity()` | 101 |
| 6107 | `_updatePlayer()` | 308 |
| 6415 | `_footstepSurface()` | 13 |
| 6428 | `_updatePickups()` | 158 |
| 6586 | `_wpnMode()` | 5 |
| 6591 | `_botWeapon()` | 10 |
| 6601 | `_municaoInfinita()` | 1 |
| 6602 | `_pickupAllowed()` | 9 |
| 6611 | `_grabNearPickup()` | 10 |
| 6621 | `_grabPickup()` | 35 |
| 6656 | `_assentarNoChao()` | 10 |
| 6666 | `refreshPickupModels()` | 24 |
| 6690 | `_dropWeapon()` | 20 |
| 6710 | `_sumirDrop()` | 36 |
| 6746 | `_spawnY()` | 3 |
| 6749 | `_spawnYaw()` | 5 |
| 6754 | `_pickSpawn()` | 23 |
| 6777 | `_respawnPlayer()` | 34 |
| 6811 | `_losClear()` | 18 |
| 6829 | `_botCall()` | 41 |
| 6870 | `_teamMarkTex()` | 23 |
| 6893 | `_makeTeamMark()` | 16 |
| 6909 | `_trocarPersonagem()` | 18 |
| 6927 | `_syncRemoteWeapon()` | 23 |
| 6950 | `_updateTeamMark()` | 7 |
| 6957 | `_botEye()` | 1 |
| 6958 | `_enemyOf()` | 8 |
| 6966 | `_duelToken()` | 22 |
| 6988 | `_respawnEntity()` | 24 |
| 7012 | `_botOuve()` | 12 |
| 7024 | `_updateBot()` | 858 |
| 7882 | `_flushTraining()` | 13 |
| 7895 | `_updateBotNN()` | 73 |
| 7968 | `_botShootNN()` | 46 |
| 8014 | `_radarFoot()` | 38 |
| 8052 | `_updateRadar()` | 64 |
| 8116 | `_banner()` | 26 |
| 8142 | `_resultadoDaRodada()` | 4 |
| 8146 | `_showScoreboard()` | 49 |
| 8195 | `_updateWeaponHud()` | 35 |
| 8230 | `_updateHud()` | 88 |
| 8318 | `update()` | 90 |
| 8408 | `dispose()` | 51 |

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
