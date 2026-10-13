# ARCH.md — mapa de arquitetura e de CONFLITO (CS BRASIL / CORO SOLTO)

<!-- BEGIN:GERADO — não edite à mão, rode `npm run arch` -->

> Gerado por `node tools/gen-arch.mjs`. **Não edite este bloco à mão.**
> Versão do jogo: 2.1.0-alpha.86 · `npm run arch` para regenerar · `npm run arch:check` no CI.

## Tamanho dos arquivos indexados

| Arquivo | Linhas | Símbolos |
|---|---:|---:|
| `public/js/game.js` | 8438 | 332 |
| `public/js/main.js` | 4510 | 336 |
| `public/js/glbchars.js` | 855 | 60 |
| `public/js/characters.js` | 1143 | 42 |
| `public/js/vmattach.js` | 633 | 4 |
| `public/js/springs.js` | 260 | 28 |
| `public/js/weapons.js` | 354 | 22 |

## Maiores métodos de `game.js` — onde o conflito mora

Os 15 maiores somam **3337 linhas (40% do arquivo)**. Método grande = PR irrevisável e merge conflitante.

| Linhas | Início | Método | |
|---:|---:|---|---|
| 838 | 7022 | `_updateBot()` | ⚠️ candidato a extração |
| 637 | 719 | `constructor()` | 🔴 append-only |
| 304 | 6124 | `_updatePlayer()` | ⚠️ candidato a extração |
| 269 | 1459 | `_buildViewModels()` |  |
| 255 | 2651 | `_resetPositions()` |  |
| 158 | 6441 | `_updatePickups()` |  |
| 137 | 5358 | `_botCtf()` |  |
| 135 | 2211 | `_touchControls()` |  |
| 101 | 6023 | `_moveEntity()` |  |
| 90 | 8296 | `update()` | 🔴 append-only |
| 88 | 8208 | `_updateHud()` |  |
| 86 | 5069 | `_initCTF()` |  |
| 81 | 3643 | `_tryShoot()` |  |
| 79 | 3289 | `_ensureVmPrecisionQa()` |  |
| 79 | 4137 | `_dmgArc()` |  |

## Tabela de CONFLITO — resolvida para as linhas de hoje

Declare sua frente antes de editar. Em `game.js` use **só a ferramenta Edit, nunca Write**.
Duas frentes com faixas disjuntas podem rodar em paralelo — foi medido: 3 agentes editaram
faixas disjuntas simultaneamente com zero conflito de conteúdo.

| Frente | Faixas em `game.js` | Arquivos exclusivos |
|---|---|---|
| **ARMAS / VIEWMODEL** | `347–350` `432–526` `556–577` `1459–1868` `3255–3288` `3485–3578` `3597–3723` `3738–3753` `3798–3867` `4398–4423` `4471–4571` `4644–4660` | `public/js/vmattach.js` `public/js/springs.js` `public/js/weapons.js` `public/js/fparms.js` `public/js/handik.js` `public/js/recoil.js` `public/js/vmlab.js` |
| **BOTS / JOGABILIDADE** | `186–189` `240–240` `266–277` `619–630` `4007–4106` `5008–5068` `5240–5494` `5577–5599` `6124–6427` `6824–6841` `6970–7000` `7022–7859` | — |
| **MAPAS / MUNDO** | `1402–1458` `2651–2905` `5069–5215` `6441–6598` | `public/js/maps.js` `public/js/mapprops.js` `public/js/map_brasilia.js` `public/js/map_havan.js` `public/js/map_piscina.js` `public/js/map_piscinao_ramos.js` `public/js/map_ferrovelho.js` |
| **GRÁFICOS / FX** | `1883–1892` `2007–2045` `3158–3171` `4424–4462` `4587–4643` | `public/js/bloom.js` `public/js/textures.js` `public/js/vao.js` `public/js/stylize.js` `public/js/gpuparticles.js` |
| **UI / HUD / MENU** | `1356–1401` `3110–3132` `3148–3157` `3172–3188` `4137–4215` `4265–4318` `4334–4397` `8030–8093` `8124–8172` `8208–8295` | `public/js/main.js` `public/style.css` `src/pages/index.astro` |
| **ÁUDIO** | — | `public/js/audio.js` |
| **PERSONAGENS** | — | `public/js/characters.js` `public/js/glbchars.js` |
| **SITE / BACKEND** | — | `src/` `supabase/` |

**🔴 Zonas vermelhas (append-only, qualquer frente pode precisar):** `update()` 8296–8385 · `_dom()` 1356–1401 · `constructor()` 719–1355

Nenhuma sobreposição entre frentes — todas as faixas são disjuntas. ✓

Cobertura: **3905 de 8438 linhas (46%)** do `game.js` têm dono declarado. O resto é território neutro — declare a frente mesmo assim.

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
| 244 | `BOT_FOCUS_MIN` | 22 |
| 270 | `BOT_TOKEN_REST` | 7 |
| 278 | `MOVE_MUL` | 6 |
| 285 | `MOVE2` | 4 |
| 289 | `STEP_H` | 3 |
| 296 | `MANTLE_APOIO` | 4 |
| 300 | `MANTLE_GRID` | 5 |
| 305 | `RACK_OLD` | 4 |
| 309 | `RACK_RETA` | 25 |
| 336 | `RADIO` | 5 |
| 342 | `MK_LABELS` | 5 |
| 347 | `GUNFEEL` | 4 |
| 354 | `TRACER_STYLE` | 6 |
| 364 | `ADS_RAMPA_S` | 3 |
| 368 | `aberturaCone` | 16 |
| 384 | `anguloDeDisparo` | 4 |
| 388 | `coneDoDisparo` | 16 |
| 405 | `D2R` | 4 |
| 409 | `DMG_FALLOFF` | 5 |
| 414 | `HS_MUL` | 3 |
| 417 | `BALL_CLASS` | 15 |
| 432 | `STATIC_CLASS` | 75 |
| 508 | `VM_KNOB` | 19 |
| 527 | `vmAdsRot` | 4 |
| 532 | `vmFovForAspect` | 24 |
| 556 | `VM_OFF` | 22 |
| 578 | `vmOffY` | 35 |
| 613 | `VMP` | 6 |
| 619 | `BOT_SKILLS` | 11 |
| 631 | `diffKey` | 4 |
| 636 | `rollBotSkill` | 7 |
| 643 | `botTier` | 4 |
| 647 | `_cyclePool` | 5 |
| 652 | `_rosterPool` | 22 |
| 676 | `_pinnedDefs` | 5 |
| 681 | `pickMatchRoster` | 21 |
| 702 | `BOT_WEAPON_POOL` | 5 |
| 707 | `pickMatchWeapons` | 9 |
| 719 | `constructor()` | 637 |
| 1356 | `_dom()` | 46 |
| 1402 | `_buildEnv()` | 57 |
| 1459 | `_buildViewModels()` | 269 |
| 1728 | `_vmFrame` | 141 |
| 1869 | `_vmMontarTardio` | 14 |
| 1883 | `_makePuffTexture()` | 10 |
| 1893 | `_makeBloodTex()` | 19 |
| 1912 | `_makeBloodPoolTex()` | 21 |
| 1933 | `_bloodDecal()` | 16 |
| 1949 | `_makeBloodFx()` | 20 |
| 1969 | `_bloodSpatter()` | 18 |
| 1987 | `_bloodPoolAt()` | 6 |
| 1993 | `_updateBlood()` | 14 |
| 2007 | `_makeFlashTex()` | 21 |
| 2028 | `_makeFlashSoftTex()` | 8 |
| 2036 | `_makeFlashCoreTex()` | 10 |
| 2046 | `_input()` | 6 |
| 2052 | `_kd` | 49 |
| 2101 | `_ku` | 5 |
| 2106 | `_md` | 40 |
| 2146 | `_mu` | 7 |
| 2153 | `_mm` | 20 |
| 2173 | `_wh` | 17 |
| 2190 | `_cc` | 1 |
| 2191 | `_blur` | 1 |
| 2192 | `_plc` | 19 |
| 2211 | `_touchControls()` | 135 |
| 2346 | `_aimAssist()` | 28 |
| 2374 | `_requestLock()` | 27 |
| 2401 | `_travaAtalhos()` | 4 |
| 2405 | `_soltaAtalhos()` | 5 |
| 2410 | `espectando()` | 2 |
| 2412 | `_acceptInput()` | 7 |
| 2419 | `travarEntrada()` | 17 |
| 2436 | `_chatSeguraPausa()` | 5 |
| 2441 | `_pauseBackdrop()` | 7 |
| 2448 | `_radioShow()` | 6 |
| 2454 | `_radioUi()` | 8 |
| 2462 | `_radioPick()` | 20 |
| 2482 | `_abilityNotice()` | 10 |
| 2492 | `_resetSliceAbilities()` | 9 |
| 2501 | `_stackTrace()` | 28 |
| 2529 | `_updateMotocaCharge()` | 10 |
| 2539 | `_recordRoutePoint()` | 11 |
| 2550 | `_routePing()` | 23 |
| 2573 | `_tickRoutePings()` | 12 |
| 2585 | `_objectiveInteractionMultiplier()` | 14 |
| 2599 | `start()` | 5 |
| 2604 | `_startAnnouncerLab()` | 9 |
| 2613 | `_startRound()` | 38 |
| 2651 | `_resetPositions()` | 255 |
| 2906 | `_checkCtfAlvo()` | 13 |
| 2919 | `_checkPace()` | 13 |
| 2932 | `_endRound()` | 34 |
| 2966 | `_roundWinnerVoice()` | 12 |
| 2978 | `_fimDaPartida()` | 7 |
| 2985 | `_endMatch()` | 61 |
| 3046 | `_ensureDolly()` | 41 |
| 3087 | `_tickDolly()` | 23 |
| 3110 | `setPaused()` | 23 |
| 3133 | `_now()` | 3 |
| 3136 | `pauseArmed()` | 1 |
| 3137 | `_syncPauseArm()` | 7 |
| 3144 | `resume()` | 4 |
| 3148 | `applySettings()` | 10 |
| 3158 | `_applyQuality()` | 14 |
| 3172 | `onResize()` | 17 |
| 3189 | `_switchTeam()` | 66 |
| 3255 | `_applyVmVisibility()` | 34 |
| 3289 | `_ensureVmPrecisionQa()` | 79 |
| 3368 | `_syncVmPresentation()` | 19 |
| 3387 | `_vmlabEnsure()` | 14 |
| 3401 | `_vmlabFrame()` | 28 |
| 3429 | `_tuneGet()` | 15 |
| 3444 | `_tune()` | 23 |
| 3467 | `_fxSet()` | 2 |
| 3469 | `_qaCicloArma()` | 8 |
| 3477 | `_cycleWeapon()` | 8 |
| 3485 | `_switchWeapon()` | 39 |
| 3524 | `_deploySfx()` | 7 |
| 3531 | `_scope()` | 17 |
| 3548 | `_zoomFov()` | 5 |
| 3553 | `_reloading()` | 1 |
| 3554 | `_startReload()` | 25 |
| 3579 | `_reloadLayers()` | 18 |
| 3597 | `_installRecoil()` | 33 |
| 3630 | `_shotRecoil()` | 13 |
| 3643 | `_tryShoot()` | 81 |
| 3724 | `_tryKnifeAttack()` | 14 |
| 3738 | `_meleeHit()` | 16 |
| 3754 | `_meleeRange()` | 5 |
| 3759 | `_botMelee()` | 28 |
| 3787 | `_shotDamage()` | 11 |
| 3798 | `_fireHitscan()` | 70 |
| 3868 | `_targetFromHit()` | 9 |
| 3877 | `_penetrationExit()` | 20 |
| 3897 | `_surfaceOf()` | 27 |
| 3924 | `_armoredTarget()` | 3 |
| 3927 | `_fleshImpact()` | 38 |
| 3965 | `_fxVoice()` | 9 |
| 3974 | `_impactSfx()` | 17 |
| 3991 | `_tintFx()` | 16 |
| 4007 | `_damage()` | 42 |
| 4049 | `_playerHurtFx()` | 5 |
| 4054 | `_kill()` | 53 |
| 4107 | `_checkArenaWin()` | 30 |
| 4137 | `_dmgArc()` | 79 |
| 4216 | `_mkBanner()` | 9 |
| 4225 | `_updateKillSequenceHud()` | 12 |
| 4237 | `_resetKillSequence()` | 5 |
| 4242 | `_playerKillFeedback()` | 18 |
| 4260 | `_acertoPrevisto()` | 5 |
| 4265 | `_hitmarker()` | 15 |
| 4280 | `_dmgNumber()` | 20 |
| 4300 | `_feed()` | 19 |
| 4319 | `_skullIcon()` | 6 |
| 4325 | `_killfeedWeaponIcon()` | 9 |
| 4334 | `_wpnIcon()` | 64 |
| 4398 | `_tracer()` | 26 |
| 4424 | `_puff()` | 39 |
| 4463 | `_holeDecalMat()` | 8 |
| 4471 | `_flash()` | 61 |
| 4532 | `_vmTetoTela()` | 10 |
| 4542 | `_muzzleWorld()` | 30 |
| 4572 | `_aimOrigin()` | 5 |
| 4577 | `_updateDoors()` | 10 |
| 4587 | `_updateFx()` | 57 |
| 4644 | `_ejectCasing()` | 17 |
| 4661 | `_makeCtfFlagTex()` | 23 |
| 4684 | `_paintFlagSymbol()` | 9 |
| 4693 | `_flagTexFor()` | 26 |
| 4719 | `_legadoSimbolo()` | 8 |
| 4727 | `_loadCtfSymbols()` | 22 |
| 4749 | `_makeCtfZoneTex()` | 31 |
| 4780 | `_makeSmokeTex()` | 10 |
| 4790 | `_updateSmokeHud()` | 4 |
| 4794 | `_grenadeSpatial()` | 14 |
| 4808 | `_spawnGrenade()` | 19 |
| 4827 | `_throwNade()` | 13 |
| 4840 | `_throwSmoke()` | 1 |
| 4841 | `_throwFrag()` | 4 |
| 4845 | `_explodeFrag()` | 40 |
| 4885 | `_corDaFumaca()` | 16 |
| 4901 | `_popSmoke()` | 23 |
| 4924 | `_updateGrenades()` | 35 |
| 4959 | `_teamColor()` | 15 |
| 4974 | `_teamInk()` | 7 |
| 4981 | `_factionOf()` | 1 |
| 4982 | `_voiceKey()` | 1 |
| 4983 | `_teamName()` | 1 |
| 4984 | `_teamTag()` | 6 |
| 4990 | `_plaqueta()` | 13 |
| 5003 | `_mirror()` | 2 |
| 5005 | `_defNoLado()` | 3 |
| 5008 | `_botSeparation()` | 61 |
| 5069 | `_initCTF()` | 86 |
| 5155 | `_updateCTF()` | 61 |
| 5216 | `_ctfWin()` | 24 |
| 5240 | `_freeYaw()` | 25 |
| 5265 | `_pullString()` | 23 |
| 5288 | `_walkReach()` | 32 |
| 5320 | `_wpComp()` | 16 |
| 5336 | `_findPathLocal()` | 22 |
| 5358 | `_botCtf()` | 137 |
| 5495 | `_hideCtfHud()` | 6 |
| 5501 | `_updateCtfHud()` | 76 |
| 5577 | `_collide()` | 23 |
| 5600 | `_collideRot()` | 22 |
| 5622 | `_mantleAlcance()` | 50 |
| 5672 | `_mantleAlcancavel()` | 12 |
| 5684 | `_mantleTarget()` | 35 |
| 5719 | `_freeSpot()` | 30 |
| 5749 | `_retaAndavel()` | 20 |
| 5769 | `_walkDepth()` | 16 |
| 5785 | `_noteHit()` | 17 |
| 5802 | `_deathFeedback()` | 45 |
| 5847 | `_toggleCamView()` | 6 |
| 5853 | `setCamView()` | 16 |
| 5869 | `_syncCamViewVis()` | 8 |
| 5877 | `_ensurePlayerTP()` | 26 |
| 5903 | `_updatePlayerTP()` | 42 |
| 5945 | `_updateCrosshairParallax()` | 47 |
| 5992 | `_tpDeath()` | 18 |
| 6010 | `_tpRevive()` | 13 |
| 6023 | `_moveEntity()` | 101 |
| 6124 | `_updatePlayer()` | 304 |
| 6428 | `_footstepSurface()` | 13 |
| 6441 | `_updatePickups()` | 158 |
| 6599 | `_wpnMode()` | 5 |
| 6604 | `_botWeapon()` | 10 |
| 6614 | `_municaoInfinita()` | 1 |
| 6615 | `_pickupAllowed()` | 9 |
| 6624 | `_grabNearPickup()` | 10 |
| 6634 | `_grabPickup()` | 35 |
| 6669 | `_assentarNoChao()` | 10 |
| 6679 | `refreshPickupModels()` | 24 |
| 6703 | `_dropWeapon()` | 20 |
| 6723 | `_sumirDrop()` | 36 |
| 6759 | `_spawnY()` | 3 |
| 6762 | `_spawnYaw()` | 5 |
| 6767 | `_pickSpawn()` | 23 |
| 6790 | `_respawnPlayer()` | 34 |
| 6824 | `_losClear()` | 18 |
| 6842 | `_botCall()` | 41 |
| 6883 | `_teamMarkTex()` | 23 |
| 6906 | `_makeTeamMark()` | 16 |
| 6922 | `_trocarPersonagem()` | 18 |
| 6940 | `_syncRemoteWeapon()` | 23 |
| 6963 | `_updateTeamMark()` | 7 |
| 6970 | `_botEye()` | 1 |
| 6971 | `_enemyOf()` | 8 |
| 6979 | `_duelToken()` | 22 |
| 7001 | `_respawnEntity()` | 21 |
| 7022 | `_updateBot()` | 838 |
| 7860 | `_flushTraining()` | 13 |
| 7873 | `_updateBotNN()` | 73 |
| 7946 | `_botShootNN()` | 46 |
| 7992 | `_radarFoot()` | 38 |
| 8030 | `_updateRadar()` | 64 |
| 8094 | `_banner()` | 26 |
| 8120 | `_resultadoDaRodada()` | 4 |
| 8124 | `_showScoreboard()` | 49 |
| 8173 | `_updateWeaponHud()` | 35 |
| 8208 | `_updateHud()` | 88 |
| 8296 | `update()` | 90 |
| 8386 | `dispose()` | 52 |

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
