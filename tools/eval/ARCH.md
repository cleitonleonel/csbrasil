# ARCH.md — mapa de arquitetura e de CONFLITO (CS BRASIL / CORO SOLTO)

<!-- BEGIN:GERADO — não edite à mão, rode `npm run arch` -->

> Gerado por `node tools/gen-arch.mjs`. **Não edite este bloco à mão.**
> Versão do jogo: 2.1.0-alpha.82 · `npm run arch` para regenerar · `npm run arch:check` no CI.

## Tamanho dos arquivos indexados

| Arquivo | Linhas | Símbolos |
|---|---:|---:|
| `public/js/game.js` | 8404 | 329 |
| `public/js/main.js` | 4411 | 332 |
| `public/js/glbchars.js` | 855 | 60 |
| `public/js/characters.js` | 1143 | 42 |
| `public/js/vmattach.js` | 633 | 4 |
| `public/js/springs.js` | 260 | 28 |
| `public/js/weapons.js` | 354 | 22 |

## Maiores métodos de `game.js` — onde o conflito mora

Os 15 maiores somam **3331 linhas (40% do arquivo)**. Método grande = PR irrevisável e merge conflitante.

| Linhas | Início | Método | |
|---:|---:|---|---|
| 838 | 6988 | `_updateBot()` | ⚠️ candidato a extração |
| 629 | 694 | `constructor()` | 🔴 append-only |
| 304 | 6090 | `_updatePlayer()` | ⚠️ candidato a extração |
| 271 | 1423 | `_buildViewModels()` |  |
| 255 | 2617 | `_resetPositions()` |  |
| 158 | 6407 | `_updatePickups()` |  |
| 137 | 5324 | `_botCtf()` |  |
| 135 | 2177 | `_touchControls()` |  |
| 101 | 5989 | `_moveEntity()` |  |
| 90 | 8262 | `update()` | 🔴 append-only |
| 88 | 8174 | `_updateHud()` |  |
| 86 | 5035 | `_initCTF()` |  |
| 81 | 3609 | `_tryShoot()` |  |
| 79 | 3255 | `_ensureVmPrecisionQa()` |  |
| 79 | 4103 | `_dmgArc()` |  |

## Tabela de CONFLITO — resolvida para as linhas de hoje

Declare sua frente antes de editar. Em `game.js` use **só a ferramenta Edit, nunca Write**.
Duas frentes com faixas disjuntas podem rodar em paralelo — foi medido: 3 agentes editaram
faixas disjuntas simultaneamente com zero conflito de conteúdo.

| Frente | Faixas em `game.js` | Arquivos exclusivos |
|---|---|---|
| **ARMAS / VIEWMODEL** | `339–342` `424–518` `548–569` `1423–1834` `3221–3254` `3451–3544` `3563–3689` `3704–3719` `3764–3833` `4364–4389` `4437–4537` `4610–4626` | `public/js/vmattach.js` `public/js/springs.js` `public/js/weapons.js` `public/js/fparms.js` `public/js/handik.js` `public/js/recoil.js` `public/js/vmlab.js` |
| **BOTS / JOGABILIDADE** | `178–181` `232–232` `258–269` `611–622` `3973–4072` `4974–5034` `5206–5460` `5543–5565` `6090–6393` `6790–6807` `6936–6966` `6988–7825` | — |
| **MAPAS / MUNDO** | `1369–1422` `2617–2871` `5035–5181` `6407–6564` | `public/js/maps.js` `public/js/mapprops.js` `public/js/map_brasilia.js` `public/js/map_havan.js` `public/js/map_piscina.js` `public/js/map_piscinao_ramos.js` `public/js/map_ferrovelho.js` |
| **GRÁFICOS / FX** | `1849–1858` `1973–2011` `3124–3137` `4390–4428` `4553–4609` | `public/js/bloom.js` `public/js/textures.js` `public/js/vao.js` `public/js/stylize.js` `public/js/gpuparticles.js` |
| **UI / HUD / MENU** | `1323–1368` `3076–3098` `3114–3123` `3138–3154` `4103–4181` `4231–4284` `4300–4363` `7996–8059` `8090–8138` `8174–8261` | `public/js/main.js` `public/style.css` `src/pages/index.astro` |
| **ÁUDIO** | — | `public/js/audio.js` |
| **PERSONAGENS** | — | `public/js/characters.js` `public/js/glbchars.js` |
| **SITE / BACKEND** | — | `src/` `supabase/` |

**🔴 Zonas vermelhas (append-only, qualquer frente pode precisar):** `update()` 8262–8351 · `_dom()` 1323–1368 · `constructor()` 694–1322

Nenhuma sobreposição entre frentes — todas as faixas são disjuntas. ✓

Cobertura: **3904 de 8404 linhas (46%)** do `game.js` têm dono declarado. O resto é território neutro — declare a frente mesmo assim.

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
| 1423 | `_buildViewModels()` | 271 |
| 1694 | `_vmFrame` | 141 |
| 1835 | `_vmMontarTardio` | 14 |
| 1849 | `_makePuffTexture()` | 10 |
| 1859 | `_makeBloodTex()` | 19 |
| 1878 | `_makeBloodPoolTex()` | 21 |
| 1899 | `_bloodDecal()` | 16 |
| 1915 | `_makeBloodFx()` | 20 |
| 1935 | `_bloodSpatter()` | 18 |
| 1953 | `_bloodPoolAt()` | 6 |
| 1959 | `_updateBlood()` | 14 |
| 1973 | `_makeFlashTex()` | 21 |
| 1994 | `_makeFlashSoftTex()` | 8 |
| 2002 | `_makeFlashCoreTex()` | 10 |
| 2012 | `_input()` | 6 |
| 2018 | `_kd` | 49 |
| 2067 | `_ku` | 5 |
| 2072 | `_md` | 40 |
| 2112 | `_mu` | 7 |
| 2119 | `_mm` | 20 |
| 2139 | `_wh` | 17 |
| 2156 | `_cc` | 1 |
| 2157 | `_blur` | 1 |
| 2158 | `_plc` | 19 |
| 2177 | `_touchControls()` | 135 |
| 2312 | `_aimAssist()` | 28 |
| 2340 | `_requestLock()` | 27 |
| 2367 | `_travaAtalhos()` | 4 |
| 2371 | `_soltaAtalhos()` | 5 |
| 2376 | `espectando()` | 2 |
| 2378 | `_acceptInput()` | 7 |
| 2385 | `travarEntrada()` | 17 |
| 2402 | `_chatSeguraPausa()` | 5 |
| 2407 | `_pauseBackdrop()` | 7 |
| 2414 | `_radioShow()` | 6 |
| 2420 | `_radioUi()` | 8 |
| 2428 | `_radioPick()` | 20 |
| 2448 | `_abilityNotice()` | 10 |
| 2458 | `_resetSliceAbilities()` | 9 |
| 2467 | `_stackTrace()` | 28 |
| 2495 | `_updateMotocaCharge()` | 10 |
| 2505 | `_recordRoutePoint()` | 11 |
| 2516 | `_routePing()` | 23 |
| 2539 | `_tickRoutePings()` | 12 |
| 2551 | `_objectiveInteractionMultiplier()` | 14 |
| 2565 | `start()` | 5 |
| 2570 | `_startAnnouncerLab()` | 9 |
| 2579 | `_startRound()` | 38 |
| 2617 | `_resetPositions()` | 255 |
| 2872 | `_checkCtfAlvo()` | 13 |
| 2885 | `_checkPace()` | 13 |
| 2898 | `_endRound()` | 34 |
| 2932 | `_roundWinnerVoice()` | 12 |
| 2944 | `_fimDaPartida()` | 7 |
| 2951 | `_endMatch()` | 61 |
| 3012 | `_ensureDolly()` | 41 |
| 3053 | `_tickDolly()` | 23 |
| 3076 | `setPaused()` | 23 |
| 3099 | `_now()` | 3 |
| 3102 | `pauseArmed()` | 1 |
| 3103 | `_syncPauseArm()` | 7 |
| 3110 | `resume()` | 4 |
| 3114 | `applySettings()` | 10 |
| 3124 | `_applyQuality()` | 14 |
| 3138 | `onResize()` | 17 |
| 3155 | `_switchTeam()` | 66 |
| 3221 | `_applyVmVisibility()` | 34 |
| 3255 | `_ensureVmPrecisionQa()` | 79 |
| 3334 | `_syncVmPresentation()` | 19 |
| 3353 | `_vmlabEnsure()` | 14 |
| 3367 | `_vmlabFrame()` | 28 |
| 3395 | `_tuneGet()` | 15 |
| 3410 | `_tune()` | 23 |
| 3433 | `_fxSet()` | 2 |
| 3435 | `_qaCicloArma()` | 8 |
| 3443 | `_cycleWeapon()` | 8 |
| 3451 | `_switchWeapon()` | 39 |
| 3490 | `_deploySfx()` | 7 |
| 3497 | `_scope()` | 17 |
| 3514 | `_zoomFov()` | 5 |
| 3519 | `_reloading()` | 1 |
| 3520 | `_startReload()` | 25 |
| 3545 | `_reloadLayers()` | 18 |
| 3563 | `_installRecoil()` | 33 |
| 3596 | `_shotRecoil()` | 13 |
| 3609 | `_tryShoot()` | 81 |
| 3690 | `_tryKnifeAttack()` | 14 |
| 3704 | `_meleeHit()` | 16 |
| 3720 | `_meleeRange()` | 5 |
| 3725 | `_botMelee()` | 28 |
| 3753 | `_shotDamage()` | 11 |
| 3764 | `_fireHitscan()` | 70 |
| 3834 | `_targetFromHit()` | 9 |
| 3843 | `_penetrationExit()` | 20 |
| 3863 | `_surfaceOf()` | 27 |
| 3890 | `_armoredTarget()` | 3 |
| 3893 | `_fleshImpact()` | 38 |
| 3931 | `_fxVoice()` | 9 |
| 3940 | `_impactSfx()` | 17 |
| 3957 | `_tintFx()` | 16 |
| 3973 | `_damage()` | 42 |
| 4015 | `_playerHurtFx()` | 5 |
| 4020 | `_kill()` | 53 |
| 4073 | `_checkArenaWin()` | 30 |
| 4103 | `_dmgArc()` | 79 |
| 4182 | `_mkBanner()` | 9 |
| 4191 | `_updateKillSequenceHud()` | 12 |
| 4203 | `_resetKillSequence()` | 5 |
| 4208 | `_playerKillFeedback()` | 18 |
| 4226 | `_acertoPrevisto()` | 5 |
| 4231 | `_hitmarker()` | 15 |
| 4246 | `_dmgNumber()` | 20 |
| 4266 | `_feed()` | 19 |
| 4285 | `_skullIcon()` | 6 |
| 4291 | `_killfeedWeaponIcon()` | 9 |
| 4300 | `_wpnIcon()` | 64 |
| 4364 | `_tracer()` | 26 |
| 4390 | `_puff()` | 39 |
| 4429 | `_holeDecalMat()` | 8 |
| 4437 | `_flash()` | 61 |
| 4498 | `_vmTetoTela()` | 10 |
| 4508 | `_muzzleWorld()` | 30 |
| 4538 | `_aimOrigin()` | 5 |
| 4543 | `_updateDoors()` | 10 |
| 4553 | `_updateFx()` | 57 |
| 4610 | `_ejectCasing()` | 17 |
| 4627 | `_makeCtfFlagTex()` | 23 |
| 4650 | `_paintFlagSymbol()` | 9 |
| 4659 | `_flagTexFor()` | 26 |
| 4685 | `_legadoSimbolo()` | 8 |
| 4693 | `_loadCtfSymbols()` | 22 |
| 4715 | `_makeCtfZoneTex()` | 31 |
| 4746 | `_makeSmokeTex()` | 10 |
| 4756 | `_updateSmokeHud()` | 4 |
| 4760 | `_grenadeSpatial()` | 14 |
| 4774 | `_spawnGrenade()` | 19 |
| 4793 | `_throwNade()` | 13 |
| 4806 | `_throwSmoke()` | 1 |
| 4807 | `_throwFrag()` | 4 |
| 4811 | `_explodeFrag()` | 40 |
| 4851 | `_corDaFumaca()` | 16 |
| 4867 | `_popSmoke()` | 23 |
| 4890 | `_updateGrenades()` | 35 |
| 4925 | `_teamColor()` | 15 |
| 4940 | `_teamInk()` | 7 |
| 4947 | `_factionOf()` | 1 |
| 4948 | `_voiceKey()` | 1 |
| 4949 | `_teamName()` | 1 |
| 4950 | `_teamTag()` | 6 |
| 4956 | `_plaqueta()` | 13 |
| 4969 | `_mirror()` | 2 |
| 4971 | `_defNoLado()` | 3 |
| 4974 | `_botSeparation()` | 61 |
| 5035 | `_initCTF()` | 86 |
| 5121 | `_updateCTF()` | 61 |
| 5182 | `_ctfWin()` | 24 |
| 5206 | `_freeYaw()` | 25 |
| 5231 | `_pullString()` | 23 |
| 5254 | `_walkReach()` | 32 |
| 5286 | `_wpComp()` | 16 |
| 5302 | `_findPathLocal()` | 22 |
| 5324 | `_botCtf()` | 137 |
| 5461 | `_hideCtfHud()` | 6 |
| 5467 | `_updateCtfHud()` | 76 |
| 5543 | `_collide()` | 23 |
| 5566 | `_collideRot()` | 22 |
| 5588 | `_mantleAlcance()` | 50 |
| 5638 | `_mantleAlcancavel()` | 12 |
| 5650 | `_mantleTarget()` | 35 |
| 5685 | `_freeSpot()` | 30 |
| 5715 | `_retaAndavel()` | 20 |
| 5735 | `_walkDepth()` | 16 |
| 5751 | `_noteHit()` | 17 |
| 5768 | `_deathFeedback()` | 45 |
| 5813 | `_toggleCamView()` | 6 |
| 5819 | `setCamView()` | 16 |
| 5835 | `_syncCamViewVis()` | 8 |
| 5843 | `_ensurePlayerTP()` | 26 |
| 5869 | `_updatePlayerTP()` | 42 |
| 5911 | `_updateCrosshairParallax()` | 47 |
| 5958 | `_tpDeath()` | 18 |
| 5976 | `_tpRevive()` | 13 |
| 5989 | `_moveEntity()` | 101 |
| 6090 | `_updatePlayer()` | 304 |
| 6394 | `_footstepSurface()` | 13 |
| 6407 | `_updatePickups()` | 158 |
| 6565 | `_wpnMode()` | 5 |
| 6570 | `_botWeapon()` | 10 |
| 6580 | `_municaoInfinita()` | 1 |
| 6581 | `_pickupAllowed()` | 9 |
| 6590 | `_grabNearPickup()` | 10 |
| 6600 | `_grabPickup()` | 35 |
| 6635 | `_assentarNoChao()` | 10 |
| 6645 | `refreshPickupModels()` | 24 |
| 6669 | `_dropWeapon()` | 20 |
| 6689 | `_sumirDrop()` | 36 |
| 6725 | `_spawnY()` | 3 |
| 6728 | `_spawnYaw()` | 5 |
| 6733 | `_pickSpawn()` | 23 |
| 6756 | `_respawnPlayer()` | 34 |
| 6790 | `_losClear()` | 18 |
| 6808 | `_botCall()` | 41 |
| 6849 | `_teamMarkTex()` | 23 |
| 6872 | `_makeTeamMark()` | 16 |
| 6888 | `_trocarPersonagem()` | 18 |
| 6906 | `_syncRemoteWeapon()` | 23 |
| 6929 | `_updateTeamMark()` | 7 |
| 6936 | `_botEye()` | 1 |
| 6937 | `_enemyOf()` | 8 |
| 6945 | `_duelToken()` | 22 |
| 6967 | `_respawnEntity()` | 21 |
| 6988 | `_updateBot()` | 838 |
| 7826 | `_flushTraining()` | 13 |
| 7839 | `_updateBotNN()` | 73 |
| 7912 | `_botShootNN()` | 46 |
| 7958 | `_radarFoot()` | 38 |
| 7996 | `_updateRadar()` | 64 |
| 8060 | `_banner()` | 26 |
| 8086 | `_resultadoDaRodada()` | 4 |
| 8090 | `_showScoreboard()` | 49 |
| 8139 | `_updateWeaponHud()` | 35 |
| 8174 | `_updateHud()` | 88 |
| 8262 | `update()` | 90 |
| 8352 | `dispose()` | 52 |

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
