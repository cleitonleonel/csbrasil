# ARCH.md — mapa de arquitetura e de CONFLITO (CS BRASIL / CORO SOLTO)

<!-- BEGIN:GERADO — não edite à mão, rode `npm run arch` -->

> Gerado por `node tools/gen-arch.mjs`. **Não edite este bloco à mão.**
> Versão do jogo: 2.1.0-alpha.86 · `npm run arch` para regenerar · `npm run arch:check` no CI.

## Tamanho dos arquivos indexados

| Arquivo | Linhas | Símbolos |
|---|---:|---:|
| `public/js/game.js` | 8494 | 338 |
| `public/js/main.js` | 4510 | 336 |
| `public/js/glbchars.js` | 855 | 60 |
| `public/js/characters.js` | 1143 | 42 |
| `public/js/vmattach.js` | 633 | 4 |
| `public/js/springs.js` | 260 | 28 |
| `public/js/weapons.js` | 354 | 22 |

## Maiores métodos de `game.js` — onde o conflito mora

Os 15 maiores somam **3362 linhas (40% do arquivo)**. Método grande = PR irrevisável e merge conflitante.

| Linhas | Início | Método | |
|---:|---:|---|---|
| 858 | 7058 | `_updateBot()` | ⚠️ candidato a extração |
| 637 | 738 | `constructor()` | 🔴 append-only |
| 308 | 6141 | `_updatePlayer()` | ⚠️ candidato a extração |
| 269 | 1475 | `_buildViewModels()` |  |
| 255 | 2667 | `_resetPositions()` |  |
| 158 | 6462 | `_updatePickups()` |  |
| 137 | 5375 | `_botCtf()` |  |
| 135 | 2227 | `_touchControls()` |  |
| 101 | 6040 | `_moveEntity()` |  |
| 90 | 8352 | `update()` | 🔴 append-only |
| 88 | 8264 | `_updateHud()` |  |
| 86 | 5086 | `_initCTF()` |  |
| 82 | 3659 | `_tryShoot()` |  |
| 79 | 3305 | `_ensureVmPrecisionQa()` |  |
| 79 | 4154 | `_dmgArc()` |  |

## Tabela de CONFLITO — resolvida para as linhas de hoje

Declare sua frente antes de editar. Em `game.js` use **só a ferramenta Edit, nunca Write**.
Duas frentes com faixas disjuntas podem rodar em paralelo — foi medido: 3 agentes editaram
faixas disjuntas simultaneamente com zero conflito de conteúdo.

| Frente | Faixas em `game.js` | Arquivos exclusivos |
|---|---|---|
| **ARMAS / VIEWMODEL** | `366–369` `451–545` `575–596` `1475–1884` `3271–3304` `3501–3594` `3613–3740` `3755–3770` `3815–3884` `4415–4440` `4488–4588` `4661–4677` | `public/js/vmattach.js` `public/js/springs.js` `public/js/weapons.js` `public/js/fparms.js` `public/js/handik.js` `public/js/recoil.js` `public/js/vmlab.js` |
| **BOTS / JOGABILIDADE** | `186–189` `240–240` `285–296` `638–649` `4024–4123` `5025–5085` `5257–5511` `5594–5616` `6141–6448` `6845–6862` `6991–7021` `7058–7915` | — |
| **MAPAS / MUNDO** | `1421–1474` `2667–2921` `5086–5232` `6462–6619` | `public/js/maps.js` `public/js/mapprops.js` `public/js/map_brasilia.js` `public/js/map_havan.js` `public/js/map_piscina.js` `public/js/map_piscinao_ramos.js` `public/js/map_ferrovelho.js` |
| **GRÁFICOS / FX** | `1899–1908` `2023–2061` `3174–3187` `4441–4479` `4604–4660` | `public/js/bloom.js` `public/js/textures.js` `public/js/vao.js` `public/js/stylize.js` `public/js/gpuparticles.js` |
| **UI / HUD / MENU** | `1375–1420` `3126–3148` `3164–3173` `3188–3204` `4154–4232` `4282–4335` `4351–4414` `8086–8149` `8180–8228` `8264–8351` | `public/js/main.js` `public/style.css` `src/pages/index.astro` |
| **ÁUDIO** | — | `public/js/audio.js` |
| **PERSONAGENS** | — | `public/js/characters.js` `public/js/glbchars.js` |
| **SITE / BACKEND** | — | `src/` `supabase/` |

**🔴 Zonas vermelhas (append-only, qualquer frente pode precisar):** `update()` 8352–8441 · `_dom()` 1375–1420 · `constructor()` 738–1374

Nenhuma sobreposição entre frentes — todas as faixas são disjuntas. ✓

Cobertura: **3927 de 8494 linhas (46%)** do `game.js` têm dono declarado. O resto é território neutro — declare a frente mesmo assim.

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
| 244 | `BOT_FOCUS_MIN` | 15 |
| 263 | `BOT_OUVE_PASSO` | 22 |
| 289 | `BOT_TOKEN_REST` | 7 |
| 297 | `MOVE_MUL` | 6 |
| 304 | `MOVE2` | 4 |
| 308 | `STEP_H` | 3 |
| 315 | `MANTLE_APOIO` | 4 |
| 319 | `MANTLE_GRID` | 5 |
| 324 | `RACK_OLD` | 4 |
| 328 | `RACK_RETA` | 25 |
| 355 | `RADIO` | 5 |
| 361 | `MK_LABELS` | 5 |
| 366 | `GUNFEEL` | 4 |
| 373 | `TRACER_STYLE` | 6 |
| 383 | `ADS_RAMPA_S` | 3 |
| 387 | `aberturaCone` | 16 |
| 403 | `anguloDeDisparo` | 4 |
| 407 | `coneDoDisparo` | 16 |
| 424 | `D2R` | 4 |
| 428 | `DMG_FALLOFF` | 5 |
| 433 | `HS_MUL` | 3 |
| 436 | `BALL_CLASS` | 15 |
| 451 | `STATIC_CLASS` | 75 |
| 527 | `VM_KNOB` | 19 |
| 546 | `vmAdsRot` | 4 |
| 551 | `vmFovForAspect` | 24 |
| 575 | `VM_OFF` | 22 |
| 597 | `vmOffY` | 35 |
| 632 | `VMP` | 6 |
| 638 | `BOT_SKILLS` | 11 |
| 650 | `diffKey` | 4 |
| 655 | `rollBotSkill` | 7 |
| 662 | `botTier` | 4 |
| 666 | `_cyclePool` | 5 |
| 671 | `_rosterPool` | 22 |
| 695 | `_pinnedDefs` | 5 |
| 700 | `pickMatchRoster` | 21 |
| 721 | `BOT_WEAPON_POOL` | 5 |
| 726 | `pickMatchWeapons` | 9 |
| 738 | `constructor()` | 637 |
| 1375 | `_dom()` | 46 |
| 1421 | `_buildEnv()` | 54 |
| 1475 | `_buildViewModels()` | 269 |
| 1744 | `_vmFrame` | 141 |
| 1885 | `_vmMontarTardio` | 14 |
| 1899 | `_makePuffTexture()` | 10 |
| 1909 | `_makeBloodTex()` | 19 |
| 1928 | `_makeBloodPoolTex()` | 21 |
| 1949 | `_bloodDecal()` | 16 |
| 1965 | `_makeBloodFx()` | 20 |
| 1985 | `_bloodSpatter()` | 18 |
| 2003 | `_bloodPoolAt()` | 6 |
| 2009 | `_updateBlood()` | 14 |
| 2023 | `_makeFlashTex()` | 21 |
| 2044 | `_makeFlashSoftTex()` | 8 |
| 2052 | `_makeFlashCoreTex()` | 10 |
| 2062 | `_input()` | 6 |
| 2068 | `_kd` | 49 |
| 2117 | `_ku` | 5 |
| 2122 | `_md` | 40 |
| 2162 | `_mu` | 7 |
| 2169 | `_mm` | 20 |
| 2189 | `_wh` | 17 |
| 2206 | `_cc` | 1 |
| 2207 | `_blur` | 1 |
| 2208 | `_plc` | 19 |
| 2227 | `_touchControls()` | 135 |
| 2362 | `_aimAssist()` | 28 |
| 2390 | `_requestLock()` | 27 |
| 2417 | `_travaAtalhos()` | 4 |
| 2421 | `_soltaAtalhos()` | 5 |
| 2426 | `espectando()` | 2 |
| 2428 | `_acceptInput()` | 7 |
| 2435 | `travarEntrada()` | 17 |
| 2452 | `_chatSeguraPausa()` | 5 |
| 2457 | `_pauseBackdrop()` | 7 |
| 2464 | `_radioShow()` | 6 |
| 2470 | `_radioUi()` | 8 |
| 2478 | `_radioPick()` | 20 |
| 2498 | `_abilityNotice()` | 10 |
| 2508 | `_resetSliceAbilities()` | 9 |
| 2517 | `_stackTrace()` | 28 |
| 2545 | `_updateMotocaCharge()` | 10 |
| 2555 | `_recordRoutePoint()` | 11 |
| 2566 | `_routePing()` | 23 |
| 2589 | `_tickRoutePings()` | 12 |
| 2601 | `_objectiveInteractionMultiplier()` | 14 |
| 2615 | `start()` | 5 |
| 2620 | `_startAnnouncerLab()` | 9 |
| 2629 | `_startRound()` | 38 |
| 2667 | `_resetPositions()` | 255 |
| 2922 | `_checkCtfAlvo()` | 13 |
| 2935 | `_checkPace()` | 13 |
| 2948 | `_endRound()` | 34 |
| 2982 | `_roundWinnerVoice()` | 12 |
| 2994 | `_fimDaPartida()` | 7 |
| 3001 | `_endMatch()` | 61 |
| 3062 | `_ensureDolly()` | 41 |
| 3103 | `_tickDolly()` | 23 |
| 3126 | `setPaused()` | 23 |
| 3149 | `_now()` | 3 |
| 3152 | `pauseArmed()` | 1 |
| 3153 | `_syncPauseArm()` | 7 |
| 3160 | `resume()` | 4 |
| 3164 | `applySettings()` | 10 |
| 3174 | `_applyQuality()` | 14 |
| 3188 | `onResize()` | 17 |
| 3205 | `_switchTeam()` | 66 |
| 3271 | `_applyVmVisibility()` | 34 |
| 3305 | `_ensureVmPrecisionQa()` | 79 |
| 3384 | `_syncVmPresentation()` | 19 |
| 3403 | `_vmlabEnsure()` | 14 |
| 3417 | `_vmlabFrame()` | 28 |
| 3445 | `_tuneGet()` | 15 |
| 3460 | `_tune()` | 23 |
| 3483 | `_fxSet()` | 2 |
| 3485 | `_qaCicloArma()` | 8 |
| 3493 | `_cycleWeapon()` | 8 |
| 3501 | `_switchWeapon()` | 39 |
| 3540 | `_deploySfx()` | 7 |
| 3547 | `_scope()` | 17 |
| 3564 | `_zoomFov()` | 5 |
| 3569 | `_reloading()` | 1 |
| 3570 | `_startReload()` | 25 |
| 3595 | `_reloadLayers()` | 18 |
| 3613 | `_installRecoil()` | 33 |
| 3646 | `_shotRecoil()` | 13 |
| 3659 | `_tryShoot()` | 82 |
| 3741 | `_tryKnifeAttack()` | 14 |
| 3755 | `_meleeHit()` | 16 |
| 3771 | `_meleeRange()` | 5 |
| 3776 | `_botMelee()` | 28 |
| 3804 | `_shotDamage()` | 11 |
| 3815 | `_fireHitscan()` | 70 |
| 3885 | `_targetFromHit()` | 9 |
| 3894 | `_penetrationExit()` | 20 |
| 3914 | `_surfaceOf()` | 27 |
| 3941 | `_armoredTarget()` | 3 |
| 3944 | `_fleshImpact()` | 38 |
| 3982 | `_fxVoice()` | 9 |
| 3991 | `_impactSfx()` | 17 |
| 4008 | `_tintFx()` | 16 |
| 4024 | `_damage()` | 42 |
| 4066 | `_playerHurtFx()` | 5 |
| 4071 | `_kill()` | 53 |
| 4124 | `_checkArenaWin()` | 30 |
| 4154 | `_dmgArc()` | 79 |
| 4233 | `_mkBanner()` | 9 |
| 4242 | `_updateKillSequenceHud()` | 12 |
| 4254 | `_resetKillSequence()` | 5 |
| 4259 | `_playerKillFeedback()` | 18 |
| 4277 | `_acertoPrevisto()` | 5 |
| 4282 | `_hitmarker()` | 15 |
| 4297 | `_dmgNumber()` | 20 |
| 4317 | `_feed()` | 19 |
| 4336 | `_skullIcon()` | 6 |
| 4342 | `_killfeedWeaponIcon()` | 9 |
| 4351 | `_wpnIcon()` | 64 |
| 4415 | `_tracer()` | 26 |
| 4441 | `_puff()` | 39 |
| 4480 | `_holeDecalMat()` | 8 |
| 4488 | `_flash()` | 61 |
| 4549 | `_vmTetoTela()` | 10 |
| 4559 | `_muzzleWorld()` | 30 |
| 4589 | `_aimOrigin()` | 5 |
| 4594 | `_updateDoors()` | 10 |
| 4604 | `_updateFx()` | 57 |
| 4661 | `_ejectCasing()` | 17 |
| 4678 | `_makeCtfFlagTex()` | 23 |
| 4701 | `_paintFlagSymbol()` | 9 |
| 4710 | `_flagTexFor()` | 26 |
| 4736 | `_legadoSimbolo()` | 8 |
| 4744 | `_loadCtfSymbols()` | 22 |
| 4766 | `_makeCtfZoneTex()` | 31 |
| 4797 | `_makeSmokeTex()` | 10 |
| 4807 | `_updateSmokeHud()` | 4 |
| 4811 | `_grenadeSpatial()` | 14 |
| 4825 | `_spawnGrenade()` | 19 |
| 4844 | `_throwNade()` | 13 |
| 4857 | `_throwSmoke()` | 1 |
| 4858 | `_throwFrag()` | 4 |
| 4862 | `_explodeFrag()` | 40 |
| 4902 | `_corDaFumaca()` | 16 |
| 4918 | `_popSmoke()` | 23 |
| 4941 | `_updateGrenades()` | 35 |
| 4976 | `_teamColor()` | 15 |
| 4991 | `_teamInk()` | 7 |
| 4998 | `_factionOf()` | 1 |
| 4999 | `_voiceKey()` | 1 |
| 5000 | `_teamName()` | 1 |
| 5001 | `_teamTag()` | 6 |
| 5007 | `_plaqueta()` | 13 |
| 5020 | `_mirror()` | 2 |
| 5022 | `_defNoLado()` | 3 |
| 5025 | `_botSeparation()` | 61 |
| 5086 | `_initCTF()` | 86 |
| 5172 | `_updateCTF()` | 61 |
| 5233 | `_ctfWin()` | 24 |
| 5257 | `_freeYaw()` | 25 |
| 5282 | `_pullString()` | 23 |
| 5305 | `_walkReach()` | 32 |
| 5337 | `_wpComp()` | 16 |
| 5353 | `_findPathLocal()` | 22 |
| 5375 | `_botCtf()` | 137 |
| 5512 | `_hideCtfHud()` | 6 |
| 5518 | `_updateCtfHud()` | 76 |
| 5594 | `_collide()` | 23 |
| 5617 | `_collideRot()` | 22 |
| 5639 | `_mantleAlcance()` | 50 |
| 5689 | `_mantleAlcancavel()` | 12 |
| 5701 | `_mantleTarget()` | 35 |
| 5736 | `_freeSpot()` | 30 |
| 5766 | `_retaAndavel()` | 20 |
| 5786 | `_walkDepth()` | 16 |
| 5802 | `_noteHit()` | 17 |
| 5819 | `_deathFeedback()` | 45 |
| 5864 | `_toggleCamView()` | 6 |
| 5870 | `setCamView()` | 16 |
| 5886 | `_syncCamViewVis()` | 8 |
| 5894 | `_ensurePlayerTP()` | 26 |
| 5920 | `_updatePlayerTP()` | 42 |
| 5962 | `_updateCrosshairParallax()` | 47 |
| 6009 | `_tpDeath()` | 18 |
| 6027 | `_tpRevive()` | 13 |
| 6040 | `_moveEntity()` | 101 |
| 6141 | `_updatePlayer()` | 308 |
| 6449 | `_footstepSurface()` | 13 |
| 6462 | `_updatePickups()` | 158 |
| 6620 | `_wpnMode()` | 5 |
| 6625 | `_botWeapon()` | 10 |
| 6635 | `_municaoInfinita()` | 1 |
| 6636 | `_pickupAllowed()` | 9 |
| 6645 | `_grabNearPickup()` | 10 |
| 6655 | `_grabPickup()` | 35 |
| 6690 | `_assentarNoChao()` | 10 |
| 6700 | `refreshPickupModels()` | 24 |
| 6724 | `_dropWeapon()` | 20 |
| 6744 | `_sumirDrop()` | 36 |
| 6780 | `_spawnY()` | 3 |
| 6783 | `_spawnYaw()` | 5 |
| 6788 | `_pickSpawn()` | 23 |
| 6811 | `_respawnPlayer()` | 34 |
| 6845 | `_losClear()` | 18 |
| 6863 | `_botCall()` | 41 |
| 6904 | `_teamMarkTex()` | 23 |
| 6927 | `_makeTeamMark()` | 16 |
| 6943 | `_trocarPersonagem()` | 18 |
| 6961 | `_syncRemoteWeapon()` | 23 |
| 6984 | `_updateTeamMark()` | 7 |
| 6991 | `_botEye()` | 1 |
| 6992 | `_enemyOf()` | 8 |
| 7000 | `_duelToken()` | 22 |
| 7022 | `_respawnEntity()` | 24 |
| 7046 | `_botOuve()` | 12 |
| 7058 | `_updateBot()` | 858 |
| 7916 | `_flushTraining()` | 13 |
| 7929 | `_updateBotNN()` | 73 |
| 8002 | `_botShootNN()` | 46 |
| 8048 | `_radarFoot()` | 38 |
| 8086 | `_updateRadar()` | 64 |
| 8150 | `_banner()` | 26 |
| 8176 | `_resultadoDaRodada()` | 4 |
| 8180 | `_showScoreboard()` | 49 |
| 8229 | `_updateWeaponHud()` | 35 |
| 8264 | `_updateHud()` | 88 |
| 8352 | `update()` | 90 |
| 8442 | `dispose()` | 52 |

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
