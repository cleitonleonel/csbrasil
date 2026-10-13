# ARCH.md — mapa de arquitetura e de CONFLITO (CS BRASIL / CORO SOLTO)

<!-- BEGIN:GERADO — não edite à mão, rode `npm run arch` -->

> Gerado por `node tools/gen-arch.mjs`. **Não edite este bloco à mão.**
> Versão do jogo: 2.1.0-alpha.89 · `npm run arch` para regenerar · `npm run arch:check` no CI.

## Tamanho dos arquivos indexados

| Arquivo | Linhas | Símbolos |
|---|---:|---:|
| `public/js/game.js` | 8437 | 332 |
| `public/js/main.js` | 4528 | 339 |
| `public/js/glbchars.js` | 856 | 60 |
| `public/js/characters.js` | 1143 | 42 |
| `public/js/vmattach.js` | 633 | 4 |
| `public/js/springs.js` | 260 | 28 |
| `public/js/weapons.js` | 354 | 22 |

## Maiores métodos de `game.js` — onde o conflito mora

Os 15 maiores somam **3337 linhas (40% do arquivo)**. Método grande = PR irrevisável e merge conflitante.

| Linhas | Início | Método | |
|---:|---:|---|---|
| 838 | 7021 | `_updateBot()` | ⚠️ candidato a extração |
| 637 | 721 | `constructor()` | 🔴 append-only |
| 304 | 6123 | `_updatePlayer()` | ⚠️ candidato a extração |
| 269 | 1458 | `_buildViewModels()` |  |
| 255 | 2650 | `_resetPositions()` |  |
| 158 | 6440 | `_updatePickups()` |  |
| 137 | 5357 | `_botCtf()` |  |
| 135 | 2210 | `_touchControls()` |  |
| 101 | 6022 | `_moveEntity()` |  |
| 90 | 8295 | `update()` | 🔴 append-only |
| 88 | 8207 | `_updateHud()` |  |
| 86 | 5068 | `_initCTF()` |  |
| 81 | 3642 | `_tryShoot()` |  |
| 79 | 3288 | `_ensureVmPrecisionQa()` |  |
| 79 | 4136 | `_dmgArc()` |  |

## Tabela de CONFLITO — resolvida para as linhas de hoje

Declare sua frente antes de editar. Em `game.js` use **só a ferramenta Edit, nunca Write**.
Duas frentes com faixas disjuntas podem rodar em paralelo — foi medido: 3 agentes editaram
faixas disjuntas simultaneamente com zero conflito de conteúdo.

| Frente | Faixas em `game.js` | Arquivos exclusivos |
|---|---|---|
| **ARMAS / VIEWMODEL** | `349–352` `434–528` `558–579` `1458–1867` `3254–3287` `3484–3577` `3596–3722` `3737–3752` `3797–3866` `4397–4422` `4470–4570` `4643–4659` | `public/js/vmattach.js` `public/js/springs.js` `public/js/weapons.js` `public/js/fparms.js` `public/js/handik.js` `public/js/recoil.js` `public/js/vmlab.js` |
| **BOTS / JOGABILIDADE** | `188–191` `242–242` `268–279` `621–632` `4006–4105` `5007–5067` `5239–5493` `5576–5598` `6123–6426` `6823–6840` `6969–6999` `7021–7858` | — |
| **MAPAS / MUNDO** | `1404–1457` `2650–2904` `5068–5214` `6440–6597` | `public/js/maps.js` `public/js/mapprops.js` `public/js/map_brasilia.js` `public/js/map_havan.js` `public/js/map_piscina.js` `public/js/map_piscinao_ramos.js` `public/js/map_ferrovelho.js` |
| **GRÁFICOS / FX** | `1882–1891` `2006–2044` `3157–3170` `4423–4461` `4586–4642` | `public/js/bloom.js` `public/js/textures.js` `public/js/vao.js` `public/js/stylize.js` `public/js/gpuparticles.js` |
| **UI / HUD / MENU** | `1358–1403` `3109–3131` `3147–3156` `3171–3187` `4136–4214` `4264–4317` `4333–4396` `8029–8092` `8123–8171` `8207–8294` | `public/js/main.js` `public/style.css` `src/pages/index.astro` |
| **ÁUDIO** | — | `public/js/audio.js` |
| **PERSONAGENS** | — | `public/js/characters.js` `public/js/glbchars.js` |
| **SITE / BACKEND** | — | `src/` `supabase/` |

**🔴 Zonas vermelhas (append-only, qualquer frente pode precisar):** `update()` 8295–8384 · `_dom()` 1358–1403 · `constructor()` 721–1357

Nenhuma sobreposição entre frentes — todas as faixas são disjuntas. ✓

Cobertura: **3902 de 8437 linhas (46%)** do `game.js` têm dono declarado. O resto é território neutro — declare a frente mesmo assim.

<details><summary><strong>Índice completo de <code>game.js</code> (todos os símbolos)</strong></summary>

| Linha | Símbolo | Linhas |
|---:|---|---:|
| 51 | `ANNOUNCER_LAB` | 4 |
| 55 | `VMLAB` | 3 |
| 60 | `VM_QA_CICLO` | 3 |
| 64 | `VM_QA_ADS` | 8 |
| 72 | `VM_MAT_LEGACY` | 4 |
| 78 | `DROP_TTL` | 8 |
| 86 | `ROUNDS_MAX` | 27 |
| 114 | `CTF_ROUNDS_TO_WIN` | 4 |
| 119 | `sanitizeRounds` | 4 |
| 124 | `CTF_CLOCK_SHOW` | 4 |
| 128 | `KILLS_PER_PLAYER` | 7 |
| 135 | `PACE` | 33 |
| 168 | `PAUSE_ARM_MS` | 3 |
| 171 | `CHAT_PAUSA_GUARDA_MS` | 9 |
| 181 | `confirmGate` | 7 |
| 192 | `BOT_AIM_PITCH` | 4 |
| 196 | `BOT_DMG_PLAYER` | 21 |
| 217 | `BOT_FAIR` | 5 |
| 222 | `BOT_MOVE2` | 15 |
| 246 | `BOT_FOCUS_MIN` | 22 |
| 272 | `BOT_TOKEN_REST` | 7 |
| 280 | `MOVE_MUL` | 6 |
| 287 | `MOVE2` | 4 |
| 291 | `STEP_H` | 3 |
| 298 | `MANTLE_APOIO` | 4 |
| 302 | `MANTLE_GRID` | 5 |
| 307 | `RACK_OLD` | 4 |
| 311 | `RACK_RETA` | 25 |
| 338 | `RADIO` | 5 |
| 344 | `MK_LABELS` | 5 |
| 349 | `GUNFEEL` | 4 |
| 356 | `TRACER_STYLE` | 6 |
| 366 | `ADS_RAMPA_S` | 3 |
| 370 | `aberturaCone` | 16 |
| 386 | `anguloDeDisparo` | 4 |
| 390 | `coneDoDisparo` | 16 |
| 407 | `D2R` | 4 |
| 411 | `DMG_FALLOFF` | 5 |
| 416 | `HS_MUL` | 3 |
| 419 | `BALL_CLASS` | 15 |
| 434 | `STATIC_CLASS` | 75 |
| 510 | `VM_KNOB` | 19 |
| 529 | `vmAdsRot` | 4 |
| 534 | `vmFovForAspect` | 24 |
| 558 | `VM_OFF` | 22 |
| 580 | `vmOffY` | 35 |
| 615 | `VMP` | 6 |
| 621 | `BOT_SKILLS` | 11 |
| 633 | `diffKey` | 4 |
| 638 | `rollBotSkill` | 7 |
| 645 | `botTier` | 4 |
| 649 | `_cyclePool` | 5 |
| 654 | `_rosterPool` | 22 |
| 678 | `_pinnedDefs` | 5 |
| 683 | `pickMatchRoster` | 21 |
| 704 | `BOT_WEAPON_POOL` | 5 |
| 709 | `pickMatchWeapons` | 9 |
| 721 | `constructor()` | 637 |
| 1358 | `_dom()` | 46 |
| 1404 | `_buildEnv()` | 54 |
| 1458 | `_buildViewModels()` | 269 |
| 1727 | `_vmFrame` | 141 |
| 1868 | `_vmMontarTardio` | 14 |
| 1882 | `_makePuffTexture()` | 10 |
| 1892 | `_makeBloodTex()` | 19 |
| 1911 | `_makeBloodPoolTex()` | 21 |
| 1932 | `_bloodDecal()` | 16 |
| 1948 | `_makeBloodFx()` | 20 |
| 1968 | `_bloodSpatter()` | 18 |
| 1986 | `_bloodPoolAt()` | 6 |
| 1992 | `_updateBlood()` | 14 |
| 2006 | `_makeFlashTex()` | 21 |
| 2027 | `_makeFlashSoftTex()` | 8 |
| 2035 | `_makeFlashCoreTex()` | 10 |
| 2045 | `_input()` | 6 |
| 2051 | `_kd` | 49 |
| 2100 | `_ku` | 5 |
| 2105 | `_md` | 40 |
| 2145 | `_mu` | 7 |
| 2152 | `_mm` | 20 |
| 2172 | `_wh` | 17 |
| 2189 | `_cc` | 1 |
| 2190 | `_blur` | 1 |
| 2191 | `_plc` | 19 |
| 2210 | `_touchControls()` | 135 |
| 2345 | `_aimAssist()` | 28 |
| 2373 | `_requestLock()` | 27 |
| 2400 | `_travaAtalhos()` | 4 |
| 2404 | `_soltaAtalhos()` | 5 |
| 2409 | `espectando()` | 2 |
| 2411 | `_acceptInput()` | 7 |
| 2418 | `travarEntrada()` | 17 |
| 2435 | `_chatSeguraPausa()` | 5 |
| 2440 | `_pauseBackdrop()` | 7 |
| 2447 | `_radioShow()` | 6 |
| 2453 | `_radioUi()` | 8 |
| 2461 | `_radioPick()` | 20 |
| 2481 | `_abilityNotice()` | 10 |
| 2491 | `_resetSliceAbilities()` | 9 |
| 2500 | `_stackTrace()` | 28 |
| 2528 | `_updateMotocaCharge()` | 10 |
| 2538 | `_recordRoutePoint()` | 11 |
| 2549 | `_routePing()` | 23 |
| 2572 | `_tickRoutePings()` | 12 |
| 2584 | `_objectiveInteractionMultiplier()` | 14 |
| 2598 | `start()` | 5 |
| 2603 | `_startAnnouncerLab()` | 9 |
| 2612 | `_startRound()` | 38 |
| 2650 | `_resetPositions()` | 255 |
| 2905 | `_checkCtfAlvo()` | 13 |
| 2918 | `_checkPace()` | 13 |
| 2931 | `_endRound()` | 34 |
| 2965 | `_roundWinnerVoice()` | 12 |
| 2977 | `_fimDaPartida()` | 7 |
| 2984 | `_endMatch()` | 61 |
| 3045 | `_ensureDolly()` | 41 |
| 3086 | `_tickDolly()` | 23 |
| 3109 | `setPaused()` | 23 |
| 3132 | `_now()` | 3 |
| 3135 | `pauseArmed()` | 1 |
| 3136 | `_syncPauseArm()` | 7 |
| 3143 | `resume()` | 4 |
| 3147 | `applySettings()` | 10 |
| 3157 | `_applyQuality()` | 14 |
| 3171 | `onResize()` | 17 |
| 3188 | `_switchTeam()` | 66 |
| 3254 | `_applyVmVisibility()` | 34 |
| 3288 | `_ensureVmPrecisionQa()` | 79 |
| 3367 | `_syncVmPresentation()` | 19 |
| 3386 | `_vmlabEnsure()` | 14 |
| 3400 | `_vmlabFrame()` | 28 |
| 3428 | `_tuneGet()` | 15 |
| 3443 | `_tune()` | 23 |
| 3466 | `_fxSet()` | 2 |
| 3468 | `_qaCicloArma()` | 8 |
| 3476 | `_cycleWeapon()` | 8 |
| 3484 | `_switchWeapon()` | 39 |
| 3523 | `_deploySfx()` | 7 |
| 3530 | `_scope()` | 17 |
| 3547 | `_zoomFov()` | 5 |
| 3552 | `_reloading()` | 1 |
| 3553 | `_startReload()` | 25 |
| 3578 | `_reloadLayers()` | 18 |
| 3596 | `_installRecoil()` | 33 |
| 3629 | `_shotRecoil()` | 13 |
| 3642 | `_tryShoot()` | 81 |
| 3723 | `_tryKnifeAttack()` | 14 |
| 3737 | `_meleeHit()` | 16 |
| 3753 | `_meleeRange()` | 5 |
| 3758 | `_botMelee()` | 28 |
| 3786 | `_shotDamage()` | 11 |
| 3797 | `_fireHitscan()` | 70 |
| 3867 | `_targetFromHit()` | 9 |
| 3876 | `_penetrationExit()` | 20 |
| 3896 | `_surfaceOf()` | 27 |
| 3923 | `_armoredTarget()` | 3 |
| 3926 | `_fleshImpact()` | 38 |
| 3964 | `_fxVoice()` | 9 |
| 3973 | `_impactSfx()` | 17 |
| 3990 | `_tintFx()` | 16 |
| 4006 | `_damage()` | 42 |
| 4048 | `_playerHurtFx()` | 5 |
| 4053 | `_kill()` | 53 |
| 4106 | `_checkArenaWin()` | 30 |
| 4136 | `_dmgArc()` | 79 |
| 4215 | `_mkBanner()` | 9 |
| 4224 | `_updateKillSequenceHud()` | 12 |
| 4236 | `_resetKillSequence()` | 5 |
| 4241 | `_playerKillFeedback()` | 18 |
| 4259 | `_acertoPrevisto()` | 5 |
| 4264 | `_hitmarker()` | 15 |
| 4279 | `_dmgNumber()` | 20 |
| 4299 | `_feed()` | 19 |
| 4318 | `_skullIcon()` | 6 |
| 4324 | `_killfeedWeaponIcon()` | 9 |
| 4333 | `_wpnIcon()` | 64 |
| 4397 | `_tracer()` | 26 |
| 4423 | `_puff()` | 39 |
| 4462 | `_holeDecalMat()` | 8 |
| 4470 | `_flash()` | 61 |
| 4531 | `_vmTetoTela()` | 10 |
| 4541 | `_muzzleWorld()` | 30 |
| 4571 | `_aimOrigin()` | 5 |
| 4576 | `_updateDoors()` | 10 |
| 4586 | `_updateFx()` | 57 |
| 4643 | `_ejectCasing()` | 17 |
| 4660 | `_makeCtfFlagTex()` | 23 |
| 4683 | `_paintFlagSymbol()` | 9 |
| 4692 | `_flagTexFor()` | 26 |
| 4718 | `_legadoSimbolo()` | 8 |
| 4726 | `_loadCtfSymbols()` | 22 |
| 4748 | `_makeCtfZoneTex()` | 31 |
| 4779 | `_makeSmokeTex()` | 10 |
| 4789 | `_updateSmokeHud()` | 4 |
| 4793 | `_grenadeSpatial()` | 14 |
| 4807 | `_spawnGrenade()` | 19 |
| 4826 | `_throwNade()` | 13 |
| 4839 | `_throwSmoke()` | 1 |
| 4840 | `_throwFrag()` | 4 |
| 4844 | `_explodeFrag()` | 40 |
| 4884 | `_corDaFumaca()` | 16 |
| 4900 | `_popSmoke()` | 23 |
| 4923 | `_updateGrenades()` | 35 |
| 4958 | `_teamColor()` | 15 |
| 4973 | `_teamInk()` | 7 |
| 4980 | `_factionOf()` | 1 |
| 4981 | `_voiceKey()` | 1 |
| 4982 | `_teamName()` | 1 |
| 4983 | `_teamTag()` | 6 |
| 4989 | `_plaqueta()` | 13 |
| 5002 | `_mirror()` | 2 |
| 5004 | `_defNoLado()` | 3 |
| 5007 | `_botSeparation()` | 61 |
| 5068 | `_initCTF()` | 86 |
| 5154 | `_updateCTF()` | 61 |
| 5215 | `_ctfWin()` | 24 |
| 5239 | `_freeYaw()` | 25 |
| 5264 | `_pullString()` | 23 |
| 5287 | `_walkReach()` | 32 |
| 5319 | `_wpComp()` | 16 |
| 5335 | `_findPathLocal()` | 22 |
| 5357 | `_botCtf()` | 137 |
| 5494 | `_hideCtfHud()` | 6 |
| 5500 | `_updateCtfHud()` | 76 |
| 5576 | `_collide()` | 23 |
| 5599 | `_collideRot()` | 22 |
| 5621 | `_mantleAlcance()` | 50 |
| 5671 | `_mantleAlcancavel()` | 12 |
| 5683 | `_mantleTarget()` | 35 |
| 5718 | `_freeSpot()` | 30 |
| 5748 | `_retaAndavel()` | 20 |
| 5768 | `_walkDepth()` | 16 |
| 5784 | `_noteHit()` | 17 |
| 5801 | `_deathFeedback()` | 45 |
| 5846 | `_toggleCamView()` | 6 |
| 5852 | `setCamView()` | 16 |
| 5868 | `_syncCamViewVis()` | 8 |
| 5876 | `_ensurePlayerTP()` | 26 |
| 5902 | `_updatePlayerTP()` | 42 |
| 5944 | `_updateCrosshairParallax()` | 47 |
| 5991 | `_tpDeath()` | 18 |
| 6009 | `_tpRevive()` | 13 |
| 6022 | `_moveEntity()` | 101 |
| 6123 | `_updatePlayer()` | 304 |
| 6427 | `_footstepSurface()` | 13 |
| 6440 | `_updatePickups()` | 158 |
| 6598 | `_wpnMode()` | 5 |
| 6603 | `_botWeapon()` | 10 |
| 6613 | `_municaoInfinita()` | 1 |
| 6614 | `_pickupAllowed()` | 9 |
| 6623 | `_grabNearPickup()` | 10 |
| 6633 | `_grabPickup()` | 35 |
| 6668 | `_assentarNoChao()` | 10 |
| 6678 | `refreshPickupModels()` | 24 |
| 6702 | `_dropWeapon()` | 20 |
| 6722 | `_sumirDrop()` | 36 |
| 6758 | `_spawnY()` | 3 |
| 6761 | `_spawnYaw()` | 5 |
| 6766 | `_pickSpawn()` | 23 |
| 6789 | `_respawnPlayer()` | 34 |
| 6823 | `_losClear()` | 18 |
| 6841 | `_botCall()` | 41 |
| 6882 | `_teamMarkTex()` | 23 |
| 6905 | `_makeTeamMark()` | 16 |
| 6921 | `_trocarPersonagem()` | 18 |
| 6939 | `_syncRemoteWeapon()` | 23 |
| 6962 | `_updateTeamMark()` | 7 |
| 6969 | `_botEye()` | 1 |
| 6970 | `_enemyOf()` | 8 |
| 6978 | `_duelToken()` | 22 |
| 7000 | `_respawnEntity()` | 21 |
| 7021 | `_updateBot()` | 838 |
| 7859 | `_flushTraining()` | 13 |
| 7872 | `_updateBotNN()` | 73 |
| 7945 | `_botShootNN()` | 46 |
| 7991 | `_radarFoot()` | 38 |
| 8029 | `_updateRadar()` | 64 |
| 8093 | `_banner()` | 26 |
| 8119 | `_resultadoDaRodada()` | 4 |
| 8123 | `_showScoreboard()` | 49 |
| 8172 | `_updateWeaponHud()` | 35 |
| 8207 | `_updateHud()` | 88 |
| 8295 | `update()` | 90 |
| 8385 | `dispose()` | 52 |

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
