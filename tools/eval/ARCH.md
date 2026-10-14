# ARCH.md — mapa de arquitetura e de CONFLITO (CS BRASIL / CORO SOLTO)

<!-- BEGIN:GERADO — não edite à mão, rode `npm run arch` -->

> Gerado por `node tools/gen-arch.mjs`. **Não edite este bloco à mão.**
> Versão do jogo: 2.1.0-alpha.89 · `npm run arch` para regenerar · `npm run arch:check` no CI.

## Tamanho dos arquivos indexados

| Arquivo | Linhas | Símbolos |
|---|---:|---:|
| `public/js/game.js` | 8490 | 338 |
| `public/js/main.js` | 4753 | 351 |
| `public/js/glbchars.js` | 893 | 62 |
| `public/js/characters.js` | 1143 | 42 |
| `public/js/vmattach.js` | 633 | 4 |
| `public/js/springs.js` | 260 | 28 |
| `public/js/weapons.js` | 354 | 22 |

## Maiores métodos de `game.js` — onde o conflito mora

Os 15 maiores somam **3365 linhas (40% do arquivo)**. Método grande = PR irrevisável e merge conflitante.

| Linhas | Início | Método | |
|---:|---:|---|---|
| 858 | 7054 | `_updateBot()` | ⚠️ candidato a extração |
| 638 | 727 | `constructor()` | 🔴 append-only |
| 308 | 6136 | `_updatePlayer()` | ⚠️ candidato a extração |
| 271 | 1468 | `_buildViewModels()` |  |
| 255 | 2662 | `_resetPositions()` |  |
| 158 | 6457 | `_updatePickups()` |  |
| 137 | 5370 | `_botCtf()` |  |
| 135 | 2222 | `_touchControls()` |  |
| 101 | 6035 | `_moveEntity()` |  |
| 90 | 8348 | `update()` | 🔴 append-only |
| 88 | 8260 | `_updateHud()` |  |
| 86 | 5081 | `_initCTF()` |  |
| 82 | 3654 | `_tryShoot()` |  |
| 79 | 3300 | `_ensureVmPrecisionQa()` |  |
| 79 | 4149 | `_dmgArc()` |  |

## Tabela de CONFLITO — resolvida para as linhas de hoje

Declare sua frente antes de editar. Em `game.js` use **só a ferramenta Edit, nunca Write**.
Duas frentes com faixas disjuntas podem rodar em paralelo — foi medido: 3 agentes editaram
faixas disjuntas simultaneamente com zero conflito de conteúdo.

| Frente | Faixas em `game.js` | Arquivos exclusivos |
|---|---|---|
| **ARMAS / VIEWMODEL** | `355–358` `440–534` `564–585` `1468–1879` `3266–3299` `3496–3589` `3608–3735` `3750–3765` `3810–3879` `4410–4435` `4483–4583` `4656–4672` | `public/js/vmattach.js` `public/js/springs.js` `public/js/weapons.js` `public/js/fparms.js` `public/js/handik.js` `public/js/recoil.js` `public/js/vmlab.js` |
| **BOTS / JOGABILIDADE** | `187–190` `241–241` `274–285` `627–638` `4019–4118` `5020–5080` `5252–5506` `5589–5611` `6136–6443` `6842–6859` `6989–7019` `7054–7911` | — |
| **MAPAS / MUNDO** | `1411–1467` `2662–2916` `5081–5227` `6457–6614` | `public/js/maps.js` `public/js/mapprops.js` `public/js/map_brasilia.js` `public/js/map_havan.js` `public/js/map_piscina.js` `public/js/map_piscinao_ramos.js` `public/js/map_ferrovelho.js` |
| **GRÁFICOS / FX** | `1894–1903` `2018–2056` `3169–3182` `4436–4474` `4599–4655` | `public/js/bloom.js` `public/js/textures.js` `public/js/vao.js` `public/js/stylize.js` `public/js/gpuparticles.js` |
| **UI / HUD / MENU** | `1365–1410` `3121–3143` `3159–3168` `3183–3199` `4149–4227` `4277–4330` `4346–4409` `8082–8145` `8176–8224` `8260–8347` | `public/js/main.js` `public/style.css` `src/pages/index.astro` |
| **ÁUDIO** | — | `public/js/audio.js` |
| **PERSONAGENS** | — | `public/js/characters.js` `public/js/glbchars.js` |
| **SITE / BACKEND** | — | `src/` `supabase/` |

**🔴 Zonas vermelhas (append-only, qualquer frente pode precisar):** `update()` 8348–8437 · `_dom()` 1365–1410 · `constructor()` 727–1364

Nenhuma sobreposição entre frentes — todas as faixas são disjuntas. ✓

Cobertura: **3932 de 8490 linhas (46%)** do `game.js` têm dono declarado. O resto é território neutro — declare a frente mesmo assim.

<details><summary><strong>Índice completo de <code>game.js</code> (todos os símbolos)</strong></summary>

| Linha | Símbolo | Linhas |
|---:|---|---:|
| 50 | `ANNOUNCER_LAB` | 4 |
| 54 | `VMLAB` | 3 |
| 59 | `VM_QA_CICLO` | 3 |
| 63 | `VM_QA_ADS` | 8 |
| 71 | `VM_MAT_LEGACY` | 4 |
| 77 | `DROP_TTL` | 8 |
| 85 | `ROUNDS_MAX` | 27 |
| 113 | `CTF_ROUNDS_TO_WIN` | 4 |
| 118 | `sanitizeRounds` | 4 |
| 123 | `CTF_CLOCK_SHOW` | 4 |
| 127 | `KILLS_PER_PLAYER` | 7 |
| 134 | `PACE` | 33 |
| 167 | `PAUSE_ARM_MS` | 3 |
| 170 | `CHAT_PAUSA_GUARDA_MS` | 9 |
| 180 | `confirmGate` | 7 |
| 191 | `BOT_AIM_PITCH` | 4 |
| 195 | `BOT_DMG_PLAYER` | 21 |
| 216 | `BOT_FAIR` | 5 |
| 221 | `BOT_MOVE2` | 15 |
| 245 | `BOT_FOCUS_MIN` | 3 |
| 252 | `BOT_OUVE_PASSO` | 22 |
| 278 | `BOT_TOKEN_REST` | 7 |
| 286 | `MOVE_MUL` | 6 |
| 293 | `MOVE2` | 4 |
| 297 | `STEP_H` | 3 |
| 304 | `MANTLE_APOIO` | 4 |
| 308 | `MANTLE_GRID` | 5 |
| 313 | `RACK_OLD` | 4 |
| 317 | `RACK_RETA` | 25 |
| 344 | `RADIO` | 5 |
| 350 | `MK_LABELS` | 5 |
| 355 | `GUNFEEL` | 4 |
| 362 | `TRACER_STYLE` | 6 |
| 372 | `ADS_RAMPA_S` | 3 |
| 376 | `aberturaCone` | 16 |
| 392 | `anguloDeDisparo` | 4 |
| 396 | `coneDoDisparo` | 16 |
| 413 | `D2R` | 4 |
| 417 | `DMG_FALLOFF` | 5 |
| 422 | `HS_MUL` | 3 |
| 425 | `BALL_CLASS` | 15 |
| 440 | `STATIC_CLASS` | 75 |
| 516 | `VM_KNOB` | 19 |
| 535 | `vmAdsRot` | 4 |
| 540 | `vmFovForAspect` | 24 |
| 564 | `VM_OFF` | 22 |
| 586 | `vmOffY` | 35 |
| 621 | `VMP` | 6 |
| 627 | `BOT_SKILLS` | 11 |
| 639 | `diffKey` | 4 |
| 644 | `rollBotSkill` | 7 |
| 651 | `botTier` | 4 |
| 655 | `_cyclePool` | 5 |
| 660 | `_rosterPool` | 22 |
| 684 | `_pinnedDefs` | 5 |
| 689 | `pickMatchRoster` | 21 |
| 710 | `BOT_WEAPON_POOL` | 5 |
| 715 | `pickMatchWeapons` | 9 |
| 727 | `constructor()` | 638 |
| 1365 | `_dom()` | 46 |
| 1411 | `_buildEnv()` | 57 |
| 1468 | `_buildViewModels()` | 271 |
| 1739 | `_vmFrame` | 141 |
| 1880 | `_vmMontarTardio` | 14 |
| 1894 | `_makePuffTexture()` | 10 |
| 1904 | `_makeBloodTex()` | 19 |
| 1923 | `_makeBloodPoolTex()` | 21 |
| 1944 | `_bloodDecal()` | 16 |
| 1960 | `_makeBloodFx()` | 20 |
| 1980 | `_bloodSpatter()` | 18 |
| 1998 | `_bloodPoolAt()` | 6 |
| 2004 | `_updateBlood()` | 14 |
| 2018 | `_makeFlashTex()` | 21 |
| 2039 | `_makeFlashSoftTex()` | 8 |
| 2047 | `_makeFlashCoreTex()` | 10 |
| 2057 | `_input()` | 6 |
| 2063 | `_kd` | 49 |
| 2112 | `_ku` | 5 |
| 2117 | `_md` | 40 |
| 2157 | `_mu` | 7 |
| 2164 | `_mm` | 20 |
| 2184 | `_wh` | 17 |
| 2201 | `_cc` | 1 |
| 2202 | `_blur` | 1 |
| 2203 | `_plc` | 19 |
| 2222 | `_touchControls()` | 135 |
| 2357 | `_aimAssist()` | 28 |
| 2385 | `_requestLock()` | 27 |
| 2412 | `_travaAtalhos()` | 4 |
| 2416 | `_soltaAtalhos()` | 5 |
| 2421 | `espectando()` | 2 |
| 2423 | `_acceptInput()` | 7 |
| 2430 | `travarEntrada()` | 17 |
| 2447 | `_chatSeguraPausa()` | 5 |
| 2452 | `_pauseBackdrop()` | 7 |
| 2459 | `_radioShow()` | 6 |
| 2465 | `_radioUi()` | 8 |
| 2473 | `_radioPick()` | 20 |
| 2493 | `_abilityNotice()` | 10 |
| 2503 | `_resetSliceAbilities()` | 9 |
| 2512 | `_stackTrace()` | 28 |
| 2540 | `_updateMotocaCharge()` | 10 |
| 2550 | `_recordRoutePoint()` | 11 |
| 2561 | `_routePing()` | 23 |
| 2584 | `_tickRoutePings()` | 12 |
| 2596 | `_objectiveInteractionMultiplier()` | 14 |
| 2610 | `start()` | 5 |
| 2615 | `_startAnnouncerLab()` | 9 |
| 2624 | `_startRound()` | 38 |
| 2662 | `_resetPositions()` | 255 |
| 2917 | `_checkCtfAlvo()` | 13 |
| 2930 | `_checkPace()` | 13 |
| 2943 | `_endRound()` | 34 |
| 2977 | `_roundWinnerVoice()` | 12 |
| 2989 | `_fimDaPartida()` | 7 |
| 2996 | `_endMatch()` | 61 |
| 3057 | `_ensureDolly()` | 41 |
| 3098 | `_tickDolly()` | 23 |
| 3121 | `setPaused()` | 23 |
| 3144 | `_now()` | 3 |
| 3147 | `pauseArmed()` | 1 |
| 3148 | `_syncPauseArm()` | 7 |
| 3155 | `resume()` | 4 |
| 3159 | `applySettings()` | 10 |
| 3169 | `_applyQuality()` | 14 |
| 3183 | `onResize()` | 17 |
| 3200 | `_switchTeam()` | 66 |
| 3266 | `_applyVmVisibility()` | 34 |
| 3300 | `_ensureVmPrecisionQa()` | 79 |
| 3379 | `_syncVmPresentation()` | 19 |
| 3398 | `_vmlabEnsure()` | 14 |
| 3412 | `_vmlabFrame()` | 28 |
| 3440 | `_tuneGet()` | 15 |
| 3455 | `_tune()` | 23 |
| 3478 | `_fxSet()` | 2 |
| 3480 | `_qaCicloArma()` | 8 |
| 3488 | `_cycleWeapon()` | 8 |
| 3496 | `_switchWeapon()` | 39 |
| 3535 | `_deploySfx()` | 7 |
| 3542 | `_scope()` | 17 |
| 3559 | `_zoomFov()` | 5 |
| 3564 | `_reloading()` | 1 |
| 3565 | `_startReload()` | 25 |
| 3590 | `_reloadLayers()` | 18 |
| 3608 | `_installRecoil()` | 33 |
| 3641 | `_shotRecoil()` | 13 |
| 3654 | `_tryShoot()` | 82 |
| 3736 | `_tryKnifeAttack()` | 14 |
| 3750 | `_meleeHit()` | 16 |
| 3766 | `_meleeRange()` | 5 |
| 3771 | `_botMelee()` | 28 |
| 3799 | `_shotDamage()` | 11 |
| 3810 | `_fireHitscan()` | 70 |
| 3880 | `_targetFromHit()` | 9 |
| 3889 | `_penetrationExit()` | 20 |
| 3909 | `_surfaceOf()` | 27 |
| 3936 | `_armoredTarget()` | 3 |
| 3939 | `_fleshImpact()` | 38 |
| 3977 | `_fxVoice()` | 9 |
| 3986 | `_impactSfx()` | 17 |
| 4003 | `_tintFx()` | 16 |
| 4019 | `_damage()` | 42 |
| 4061 | `_playerHurtFx()` | 5 |
| 4066 | `_kill()` | 53 |
| 4119 | `_checkArenaWin()` | 30 |
| 4149 | `_dmgArc()` | 79 |
| 4228 | `_mkBanner()` | 9 |
| 4237 | `_updateKillSequenceHud()` | 12 |
| 4249 | `_resetKillSequence()` | 5 |
| 4254 | `_playerKillFeedback()` | 18 |
| 4272 | `_acertoPrevisto()` | 5 |
| 4277 | `_hitmarker()` | 15 |
| 4292 | `_dmgNumber()` | 20 |
| 4312 | `_feed()` | 19 |
| 4331 | `_skullIcon()` | 6 |
| 4337 | `_killfeedWeaponIcon()` | 9 |
| 4346 | `_wpnIcon()` | 64 |
| 4410 | `_tracer()` | 26 |
| 4436 | `_puff()` | 39 |
| 4475 | `_holeDecalMat()` | 8 |
| 4483 | `_flash()` | 61 |
| 4544 | `_vmTetoTela()` | 10 |
| 4554 | `_muzzleWorld()` | 30 |
| 4584 | `_aimOrigin()` | 5 |
| 4589 | `_updateDoors()` | 10 |
| 4599 | `_updateFx()` | 57 |
| 4656 | `_ejectCasing()` | 17 |
| 4673 | `_makeCtfFlagTex()` | 23 |
| 4696 | `_paintFlagSymbol()` | 9 |
| 4705 | `_flagTexFor()` | 26 |
| 4731 | `_legadoSimbolo()` | 8 |
| 4739 | `_loadCtfSymbols()` | 22 |
| 4761 | `_makeCtfZoneTex()` | 31 |
| 4792 | `_makeSmokeTex()` | 10 |
| 4802 | `_updateSmokeHud()` | 4 |
| 4806 | `_grenadeSpatial()` | 14 |
| 4820 | `_spawnGrenade()` | 19 |
| 4839 | `_throwNade()` | 13 |
| 4852 | `_throwSmoke()` | 1 |
| 4853 | `_throwFrag()` | 4 |
| 4857 | `_explodeFrag()` | 40 |
| 4897 | `_corDaFumaca()` | 16 |
| 4913 | `_popSmoke()` | 23 |
| 4936 | `_updateGrenades()` | 35 |
| 4971 | `_teamColor()` | 15 |
| 4986 | `_teamInk()` | 7 |
| 4993 | `_factionOf()` | 1 |
| 4994 | `_voiceKey()` | 1 |
| 4995 | `_teamName()` | 1 |
| 4996 | `_teamTag()` | 6 |
| 5002 | `_plaqueta()` | 13 |
| 5015 | `_mirror()` | 2 |
| 5017 | `_defNoLado()` | 3 |
| 5020 | `_botSeparation()` | 61 |
| 5081 | `_initCTF()` | 86 |
| 5167 | `_updateCTF()` | 61 |
| 5228 | `_ctfWin()` | 24 |
| 5252 | `_freeYaw()` | 25 |
| 5277 | `_pullString()` | 23 |
| 5300 | `_walkReach()` | 32 |
| 5332 | `_wpComp()` | 16 |
| 5348 | `_findPathLocal()` | 22 |
| 5370 | `_botCtf()` | 137 |
| 5507 | `_hideCtfHud()` | 6 |
| 5513 | `_updateCtfHud()` | 76 |
| 5589 | `_collide()` | 23 |
| 5612 | `_collideRot()` | 22 |
| 5634 | `_mantleAlcance()` | 50 |
| 5684 | `_mantleAlcancavel()` | 12 |
| 5696 | `_mantleTarget()` | 35 |
| 5731 | `_freeSpot()` | 30 |
| 5761 | `_retaAndavel()` | 20 |
| 5781 | `_walkDepth()` | 16 |
| 5797 | `_noteHit()` | 17 |
| 5814 | `_deathFeedback()` | 45 |
| 5859 | `_toggleCamView()` | 6 |
| 5865 | `setCamView()` | 16 |
| 5881 | `_syncCamViewVis()` | 8 |
| 5889 | `_ensurePlayerTP()` | 26 |
| 5915 | `_updatePlayerTP()` | 42 |
| 5957 | `_updateCrosshairParallax()` | 47 |
| 6004 | `_tpDeath()` | 18 |
| 6022 | `_tpRevive()` | 13 |
| 6035 | `_moveEntity()` | 101 |
| 6136 | `_updatePlayer()` | 308 |
| 6444 | `_footstepSurface()` | 13 |
| 6457 | `_updatePickups()` | 158 |
| 6615 | `_wpnMode()` | 7 |
| 6622 | `_botWeapon()` | 10 |
| 6632 | `_municaoInfinita()` | 1 |
| 6633 | `_pickupAllowed()` | 9 |
| 6642 | `_grabNearPickup()` | 10 |
| 6652 | `_grabPickup()` | 35 |
| 6687 | `_assentarNoChao()` | 10 |
| 6697 | `refreshPickupModels()` | 24 |
| 6721 | `_dropWeapon()` | 20 |
| 6741 | `_sumirDrop()` | 36 |
| 6777 | `_spawnY()` | 3 |
| 6780 | `_spawnYaw()` | 5 |
| 6785 | `_pickSpawn()` | 23 |
| 6808 | `_respawnPlayer()` | 34 |
| 6842 | `_losClear()` | 18 |
| 6860 | `_botCall()` | 41 |
| 6901 | `_teamMarkTex()` | 23 |
| 6924 | `_makeTeamMark()` | 16 |
| 6940 | `_trocarPersonagem()` | 19 |
| 6959 | `_syncRemoteWeapon()` | 23 |
| 6982 | `_updateTeamMark()` | 7 |
| 6989 | `_botEye()` | 1 |
| 6990 | `_enemyOf()` | 8 |
| 6998 | `_duelToken()` | 22 |
| 7020 | `_respawnEntity()` | 22 |
| 7042 | `_botOuve()` | 12 |
| 7054 | `_updateBot()` | 858 |
| 7912 | `_flushTraining()` | 13 |
| 7925 | `_updateBotNN()` | 73 |
| 7998 | `_botShootNN()` | 46 |
| 8044 | `_radarFoot()` | 38 |
| 8082 | `_updateRadar()` | 64 |
| 8146 | `_banner()` | 26 |
| 8172 | `_resultadoDaRodada()` | 4 |
| 8176 | `_showScoreboard()` | 49 |
| 8225 | `_updateWeaponHud()` | 35 |
| 8260 | `_updateHud()` | 88 |
| 8348 | `update()` | 90 |
| 8438 | `dispose()` | 52 |

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
