# ARCH.md — mapa de arquitetura e de CONFLITO (CS BRASIL / CORO SOLTO)

<!-- BEGIN:GERADO — não edite à mão, rode `npm run arch` -->

> Gerado por `node tools/gen-arch.mjs`. **Não edite este bloco à mão.**
> Versão do jogo: 2.1.0-alpha.87 · `npm run arch` para regenerar · `npm run arch:check` no CI.

## Tamanho dos arquivos indexados

| Arquivo | Linhas | Símbolos |
|---|---:|---:|
| `public/js/game.js` | 8487 | 338 |
| `public/js/main.js` | 4553 | 338 |
| `public/js/glbchars.js` | 855 | 60 |
| `public/js/characters.js` | 1143 | 42 |
| `public/js/vmattach.js` | 633 | 4 |
| `public/js/springs.js` | 260 | 28 |
| `public/js/weapons.js` | 354 | 22 |

## Maiores métodos de `game.js` — onde o conflito mora

Os 15 maiores somam **3364 linhas (40% do arquivo)**. Método grande = PR irrevisável e merge conflitante.

| Linhas | Início | Método | |
|---:|---:|---|---|
| 858 | 7051 | `_updateBot()` | ⚠️ candidato a extração |
| 637 | 726 | `constructor()` | 🔴 append-only |
| 308 | 6134 | `_updatePlayer()` | ⚠️ candidato a extração |
| 271 | 1466 | `_buildViewModels()` |  |
| 255 | 2660 | `_resetPositions()` |  |
| 158 | 6455 | `_updatePickups()` |  |
| 137 | 5368 | `_botCtf()` |  |
| 135 | 2220 | `_touchControls()` |  |
| 101 | 6033 | `_moveEntity()` |  |
| 90 | 8345 | `update()` | 🔴 append-only |
| 88 | 8257 | `_updateHud()` |  |
| 86 | 5079 | `_initCTF()` |  |
| 82 | 3652 | `_tryShoot()` |  |
| 79 | 3298 | `_ensureVmPrecisionQa()` |  |
| 79 | 4147 | `_dmgArc()` |  |

## Tabela de CONFLITO — resolvida para as linhas de hoje

Declare sua frente antes de editar. Em `game.js` use **só a ferramenta Edit, nunca Write**.
Duas frentes com faixas disjuntas podem rodar em paralelo — foi medido: 3 agentes editaram
faixas disjuntas simultaneamente com zero conflito de conteúdo.

| Frente | Faixas em `game.js` | Arquivos exclusivos |
|---|---|---|
| **ARMAS / VIEWMODEL** | `354–357` `439–533` `563–584` `1466–1877` `3264–3297` `3494–3587` `3606–3733` `3748–3763` `3808–3877` `4408–4433` `4481–4581` `4654–4670` | `public/js/vmattach.js` `public/js/springs.js` `public/js/weapons.js` `public/js/fparms.js` `public/js/handik.js` `public/js/recoil.js` `public/js/vmlab.js` |
| **BOTS / JOGABILIDADE** | `186–189` `240–240` `273–284` `626–637` `4017–4116` `5018–5078` `5250–5504` `5587–5609` `6134–6441` `6840–6857` `6986–7016` `7051–7908` | — |
| **MAPAS / MUNDO** | `1409–1465` `2660–2914` `5079–5225` `6455–6612` | `public/js/maps.js` `public/js/mapprops.js` `public/js/map_brasilia.js` `public/js/map_havan.js` `public/js/map_piscina.js` `public/js/map_piscinao_ramos.js` `public/js/map_ferrovelho.js` |
| **GRÁFICOS / FX** | `1892–1901` `2016–2054` `3167–3180` `4434–4472` `4597–4653` | `public/js/bloom.js` `public/js/textures.js` `public/js/vao.js` `public/js/stylize.js` `public/js/gpuparticles.js` |
| **UI / HUD / MENU** | `1363–1408` `3119–3141` `3157–3166` `3181–3197` `4147–4225` `4275–4328` `4344–4407` `8079–8142` `8173–8221` `8257–8344` | `public/js/main.js` `public/style.css` `src/pages/index.astro` |
| **ÁUDIO** | — | `public/js/audio.js` |
| **PERSONAGENS** | — | `public/js/characters.js` `public/js/glbchars.js` |
| **SITE / BACKEND** | — | `src/` `supabase/` |

**🔴 Zonas vermelhas (append-only, qualquer frente pode precisar):** `update()` 8345–8434 · `_dom()` 1363–1408 · `constructor()` 726–1362

Nenhuma sobreposição entre frentes — todas as faixas são disjuntas. ✓

Cobertura: **3932 de 8487 linhas (46%)** do `game.js` têm dono declarado. O resto é território neutro — declare a frente mesmo assim.

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
| 112 | `CTF_ROUNDS_TO_WIN` | 4 |
| 117 | `sanitizeRounds` | 4 |
| 122 | `CTF_CLOCK_SHOW` | 4 |
| 126 | `KILLS_PER_PLAYER` | 7 |
| 133 | `PACE` | 33 |
| 166 | `PAUSE_ARM_MS` | 3 |
| 169 | `CHAT_PAUSA_GUARDA_MS` | 9 |
| 179 | `confirmGate` | 7 |
| 190 | `BOT_AIM_PITCH` | 4 |
| 194 | `BOT_DMG_PLAYER` | 21 |
| 215 | `BOT_FAIR` | 5 |
| 220 | `BOT_MOVE2` | 15 |
| 244 | `BOT_FOCUS_MIN` | 3 |
| 251 | `BOT_OUVE_PASSO` | 22 |
| 277 | `BOT_TOKEN_REST` | 7 |
| 285 | `MOVE_MUL` | 6 |
| 292 | `MOVE2` | 4 |
| 296 | `STEP_H` | 3 |
| 303 | `MANTLE_APOIO` | 4 |
| 307 | `MANTLE_GRID` | 5 |
| 312 | `RACK_OLD` | 4 |
| 316 | `RACK_RETA` | 25 |
| 343 | `RADIO` | 5 |
| 349 | `MK_LABELS` | 5 |
| 354 | `GUNFEEL` | 4 |
| 361 | `TRACER_STYLE` | 6 |
| 371 | `ADS_RAMPA_S` | 3 |
| 375 | `aberturaCone` | 16 |
| 391 | `anguloDeDisparo` | 4 |
| 395 | `coneDoDisparo` | 16 |
| 412 | `D2R` | 4 |
| 416 | `DMG_FALLOFF` | 5 |
| 421 | `HS_MUL` | 3 |
| 424 | `BALL_CLASS` | 15 |
| 439 | `STATIC_CLASS` | 75 |
| 515 | `VM_KNOB` | 19 |
| 534 | `vmAdsRot` | 4 |
| 539 | `vmFovForAspect` | 24 |
| 563 | `VM_OFF` | 22 |
| 585 | `vmOffY` | 35 |
| 620 | `VMP` | 6 |
| 626 | `BOT_SKILLS` | 11 |
| 638 | `diffKey` | 4 |
| 643 | `rollBotSkill` | 7 |
| 650 | `botTier` | 4 |
| 654 | `_cyclePool` | 5 |
| 659 | `_rosterPool` | 22 |
| 683 | `_pinnedDefs` | 5 |
| 688 | `pickMatchRoster` | 21 |
| 709 | `BOT_WEAPON_POOL` | 5 |
| 714 | `pickMatchWeapons` | 9 |
| 726 | `constructor()` | 637 |
| 1363 | `_dom()` | 46 |
| 1409 | `_buildEnv()` | 57 |
| 1466 | `_buildViewModels()` | 271 |
| 1737 | `_vmFrame` | 141 |
| 1878 | `_vmMontarTardio` | 14 |
| 1892 | `_makePuffTexture()` | 10 |
| 1902 | `_makeBloodTex()` | 19 |
| 1921 | `_makeBloodPoolTex()` | 21 |
| 1942 | `_bloodDecal()` | 16 |
| 1958 | `_makeBloodFx()` | 20 |
| 1978 | `_bloodSpatter()` | 18 |
| 1996 | `_bloodPoolAt()` | 6 |
| 2002 | `_updateBlood()` | 14 |
| 2016 | `_makeFlashTex()` | 21 |
| 2037 | `_makeFlashSoftTex()` | 8 |
| 2045 | `_makeFlashCoreTex()` | 10 |
| 2055 | `_input()` | 6 |
| 2061 | `_kd` | 49 |
| 2110 | `_ku` | 5 |
| 2115 | `_md` | 40 |
| 2155 | `_mu` | 7 |
| 2162 | `_mm` | 20 |
| 2182 | `_wh` | 17 |
| 2199 | `_cc` | 1 |
| 2200 | `_blur` | 1 |
| 2201 | `_plc` | 19 |
| 2220 | `_touchControls()` | 135 |
| 2355 | `_aimAssist()` | 28 |
| 2383 | `_requestLock()` | 27 |
| 2410 | `_travaAtalhos()` | 4 |
| 2414 | `_soltaAtalhos()` | 5 |
| 2419 | `espectando()` | 2 |
| 2421 | `_acceptInput()` | 7 |
| 2428 | `travarEntrada()` | 17 |
| 2445 | `_chatSeguraPausa()` | 5 |
| 2450 | `_pauseBackdrop()` | 7 |
| 2457 | `_radioShow()` | 6 |
| 2463 | `_radioUi()` | 8 |
| 2471 | `_radioPick()` | 20 |
| 2491 | `_abilityNotice()` | 10 |
| 2501 | `_resetSliceAbilities()` | 9 |
| 2510 | `_stackTrace()` | 28 |
| 2538 | `_updateMotocaCharge()` | 10 |
| 2548 | `_recordRoutePoint()` | 11 |
| 2559 | `_routePing()` | 23 |
| 2582 | `_tickRoutePings()` | 12 |
| 2594 | `_objectiveInteractionMultiplier()` | 14 |
| 2608 | `start()` | 5 |
| 2613 | `_startAnnouncerLab()` | 9 |
| 2622 | `_startRound()` | 38 |
| 2660 | `_resetPositions()` | 255 |
| 2915 | `_checkCtfAlvo()` | 13 |
| 2928 | `_checkPace()` | 13 |
| 2941 | `_endRound()` | 34 |
| 2975 | `_roundWinnerVoice()` | 12 |
| 2987 | `_fimDaPartida()` | 7 |
| 2994 | `_endMatch()` | 61 |
| 3055 | `_ensureDolly()` | 41 |
| 3096 | `_tickDolly()` | 23 |
| 3119 | `setPaused()` | 23 |
| 3142 | `_now()` | 3 |
| 3145 | `pauseArmed()` | 1 |
| 3146 | `_syncPauseArm()` | 7 |
| 3153 | `resume()` | 4 |
| 3157 | `applySettings()` | 10 |
| 3167 | `_applyQuality()` | 14 |
| 3181 | `onResize()` | 17 |
| 3198 | `_switchTeam()` | 66 |
| 3264 | `_applyVmVisibility()` | 34 |
| 3298 | `_ensureVmPrecisionQa()` | 79 |
| 3377 | `_syncVmPresentation()` | 19 |
| 3396 | `_vmlabEnsure()` | 14 |
| 3410 | `_vmlabFrame()` | 28 |
| 3438 | `_tuneGet()` | 15 |
| 3453 | `_tune()` | 23 |
| 3476 | `_fxSet()` | 2 |
| 3478 | `_qaCicloArma()` | 8 |
| 3486 | `_cycleWeapon()` | 8 |
| 3494 | `_switchWeapon()` | 39 |
| 3533 | `_deploySfx()` | 7 |
| 3540 | `_scope()` | 17 |
| 3557 | `_zoomFov()` | 5 |
| 3562 | `_reloading()` | 1 |
| 3563 | `_startReload()` | 25 |
| 3588 | `_reloadLayers()` | 18 |
| 3606 | `_installRecoil()` | 33 |
| 3639 | `_shotRecoil()` | 13 |
| 3652 | `_tryShoot()` | 82 |
| 3734 | `_tryKnifeAttack()` | 14 |
| 3748 | `_meleeHit()` | 16 |
| 3764 | `_meleeRange()` | 5 |
| 3769 | `_botMelee()` | 28 |
| 3797 | `_shotDamage()` | 11 |
| 3808 | `_fireHitscan()` | 70 |
| 3878 | `_targetFromHit()` | 9 |
| 3887 | `_penetrationExit()` | 20 |
| 3907 | `_surfaceOf()` | 27 |
| 3934 | `_armoredTarget()` | 3 |
| 3937 | `_fleshImpact()` | 38 |
| 3975 | `_fxVoice()` | 9 |
| 3984 | `_impactSfx()` | 17 |
| 4001 | `_tintFx()` | 16 |
| 4017 | `_damage()` | 42 |
| 4059 | `_playerHurtFx()` | 5 |
| 4064 | `_kill()` | 53 |
| 4117 | `_checkArenaWin()` | 30 |
| 4147 | `_dmgArc()` | 79 |
| 4226 | `_mkBanner()` | 9 |
| 4235 | `_updateKillSequenceHud()` | 12 |
| 4247 | `_resetKillSequence()` | 5 |
| 4252 | `_playerKillFeedback()` | 18 |
| 4270 | `_acertoPrevisto()` | 5 |
| 4275 | `_hitmarker()` | 15 |
| 4290 | `_dmgNumber()` | 20 |
| 4310 | `_feed()` | 19 |
| 4329 | `_skullIcon()` | 6 |
| 4335 | `_killfeedWeaponIcon()` | 9 |
| 4344 | `_wpnIcon()` | 64 |
| 4408 | `_tracer()` | 26 |
| 4434 | `_puff()` | 39 |
| 4473 | `_holeDecalMat()` | 8 |
| 4481 | `_flash()` | 61 |
| 4542 | `_vmTetoTela()` | 10 |
| 4552 | `_muzzleWorld()` | 30 |
| 4582 | `_aimOrigin()` | 5 |
| 4587 | `_updateDoors()` | 10 |
| 4597 | `_updateFx()` | 57 |
| 4654 | `_ejectCasing()` | 17 |
| 4671 | `_makeCtfFlagTex()` | 23 |
| 4694 | `_paintFlagSymbol()` | 9 |
| 4703 | `_flagTexFor()` | 26 |
| 4729 | `_legadoSimbolo()` | 8 |
| 4737 | `_loadCtfSymbols()` | 22 |
| 4759 | `_makeCtfZoneTex()` | 31 |
| 4790 | `_makeSmokeTex()` | 10 |
| 4800 | `_updateSmokeHud()` | 4 |
| 4804 | `_grenadeSpatial()` | 14 |
| 4818 | `_spawnGrenade()` | 19 |
| 4837 | `_throwNade()` | 13 |
| 4850 | `_throwSmoke()` | 1 |
| 4851 | `_throwFrag()` | 4 |
| 4855 | `_explodeFrag()` | 40 |
| 4895 | `_corDaFumaca()` | 16 |
| 4911 | `_popSmoke()` | 23 |
| 4934 | `_updateGrenades()` | 35 |
| 4969 | `_teamColor()` | 15 |
| 4984 | `_teamInk()` | 7 |
| 4991 | `_factionOf()` | 1 |
| 4992 | `_voiceKey()` | 1 |
| 4993 | `_teamName()` | 1 |
| 4994 | `_teamTag()` | 6 |
| 5000 | `_plaqueta()` | 13 |
| 5013 | `_mirror()` | 2 |
| 5015 | `_defNoLado()` | 3 |
| 5018 | `_botSeparation()` | 61 |
| 5079 | `_initCTF()` | 86 |
| 5165 | `_updateCTF()` | 61 |
| 5226 | `_ctfWin()` | 24 |
| 5250 | `_freeYaw()` | 25 |
| 5275 | `_pullString()` | 23 |
| 5298 | `_walkReach()` | 32 |
| 5330 | `_wpComp()` | 16 |
| 5346 | `_findPathLocal()` | 22 |
| 5368 | `_botCtf()` | 137 |
| 5505 | `_hideCtfHud()` | 6 |
| 5511 | `_updateCtfHud()` | 76 |
| 5587 | `_collide()` | 23 |
| 5610 | `_collideRot()` | 22 |
| 5632 | `_mantleAlcance()` | 50 |
| 5682 | `_mantleAlcancavel()` | 12 |
| 5694 | `_mantleTarget()` | 35 |
| 5729 | `_freeSpot()` | 30 |
| 5759 | `_retaAndavel()` | 20 |
| 5779 | `_walkDepth()` | 16 |
| 5795 | `_noteHit()` | 17 |
| 5812 | `_deathFeedback()` | 45 |
| 5857 | `_toggleCamView()` | 6 |
| 5863 | `setCamView()` | 16 |
| 5879 | `_syncCamViewVis()` | 8 |
| 5887 | `_ensurePlayerTP()` | 26 |
| 5913 | `_updatePlayerTP()` | 42 |
| 5955 | `_updateCrosshairParallax()` | 47 |
| 6002 | `_tpDeath()` | 18 |
| 6020 | `_tpRevive()` | 13 |
| 6033 | `_moveEntity()` | 101 |
| 6134 | `_updatePlayer()` | 308 |
| 6442 | `_footstepSurface()` | 13 |
| 6455 | `_updatePickups()` | 158 |
| 6613 | `_wpnMode()` | 7 |
| 6620 | `_botWeapon()` | 10 |
| 6630 | `_municaoInfinita()` | 1 |
| 6631 | `_pickupAllowed()` | 9 |
| 6640 | `_grabNearPickup()` | 10 |
| 6650 | `_grabPickup()` | 35 |
| 6685 | `_assentarNoChao()` | 10 |
| 6695 | `refreshPickupModels()` | 24 |
| 6719 | `_dropWeapon()` | 20 |
| 6739 | `_sumirDrop()` | 36 |
| 6775 | `_spawnY()` | 3 |
| 6778 | `_spawnYaw()` | 5 |
| 6783 | `_pickSpawn()` | 23 |
| 6806 | `_respawnPlayer()` | 34 |
| 6840 | `_losClear()` | 18 |
| 6858 | `_botCall()` | 41 |
| 6899 | `_teamMarkTex()` | 23 |
| 6922 | `_makeTeamMark()` | 16 |
| 6938 | `_trocarPersonagem()` | 18 |
| 6956 | `_syncRemoteWeapon()` | 23 |
| 6979 | `_updateTeamMark()` | 7 |
| 6986 | `_botEye()` | 1 |
| 6987 | `_enemyOf()` | 8 |
| 6995 | `_duelToken()` | 22 |
| 7017 | `_respawnEntity()` | 22 |
| 7039 | `_botOuve()` | 12 |
| 7051 | `_updateBot()` | 858 |
| 7909 | `_flushTraining()` | 13 |
| 7922 | `_updateBotNN()` | 73 |
| 7995 | `_botShootNN()` | 46 |
| 8041 | `_radarFoot()` | 38 |
| 8079 | `_updateRadar()` | 64 |
| 8143 | `_banner()` | 26 |
| 8169 | `_resultadoDaRodada()` | 4 |
| 8173 | `_showScoreboard()` | 49 |
| 8222 | `_updateWeaponHud()` | 35 |
| 8257 | `_updateHud()` | 88 |
| 8345 | `update()` | 90 |
| 8435 | `dispose()` | 52 |

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
