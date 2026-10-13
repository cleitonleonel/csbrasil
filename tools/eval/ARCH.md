# ARCH.md — mapa de arquitetura e de CONFLITO (CS BRASIL / CORO SOLTO)

<!-- BEGIN:GERADO — não edite à mão, rode `npm run arch` -->

> Gerado por `node tools/gen-arch.mjs`. **Não edite este bloco à mão.**
> Versão do jogo: 2.1.0-alpha.87 · `npm run arch` para regenerar · `npm run arch:check` no CI.

## Tamanho dos arquivos indexados

| Arquivo | Linhas | Símbolos |
|---|---:|---:|
| `public/js/game.js` | 8480 | 338 |
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
| 858 | 7044 | `_updateBot()` | ⚠️ candidato a extração |
| 637 | 726 | `constructor()` | 🔴 append-only |
| 308 | 6129 | `_updatePlayer()` | ⚠️ candidato a extração |
| 269 | 1463 | `_buildViewModels()` |  |
| 255 | 2655 | `_resetPositions()` |  |
| 158 | 6450 | `_updatePickups()` |  |
| 137 | 5363 | `_botCtf()` |  |
| 135 | 2215 | `_touchControls()` |  |
| 101 | 6028 | `_moveEntity()` |  |
| 90 | 8338 | `update()` | 🔴 append-only |
| 88 | 8250 | `_updateHud()` |  |
| 86 | 5074 | `_initCTF()` |  |
| 82 | 3647 | `_tryShoot()` |  |
| 79 | 3293 | `_ensureVmPrecisionQa()` |  |
| 79 | 4142 | `_dmgArc()` |  |

## Tabela de CONFLITO — resolvida para as linhas de hoje

Declare sua frente antes de editar. Em `game.js` use **só a ferramenta Edit, nunca Write**.
Duas frentes com faixas disjuntas podem rodar em paralelo — foi medido: 3 agentes editaram
faixas disjuntas simultaneamente com zero conflito de conteúdo.

| Frente | Faixas em `game.js` | Arquivos exclusivos |
|---|---|---|
| **ARMAS / VIEWMODEL** | `354–357` `439–533` `563–584` `1463–1872` `3259–3292` `3489–3582` `3601–3728` `3743–3758` `3803–3872` `4403–4428` `4476–4576` `4649–4665` | `public/js/vmattach.js` `public/js/springs.js` `public/js/weapons.js` `public/js/fparms.js` `public/js/handik.js` `public/js/recoil.js` `public/js/vmlab.js` |
| **BOTS / JOGABILIDADE** | `186–189` `240–240` `273–284` `626–637` `4012–4111` `5013–5073` `5245–5499` `5582–5604` `6129–6436` `6833–6850` `6979–7009` `7044–7901` | — |
| **MAPAS / MUNDO** | `1409–1462` `2655–2909` `5074–5220` `6450–6607` | `public/js/maps.js` `public/js/mapprops.js` `public/js/map_brasilia.js` `public/js/map_havan.js` `public/js/map_piscina.js` `public/js/map_piscinao_ramos.js` `public/js/map_ferrovelho.js` |
| **GRÁFICOS / FX** | `1887–1896` `2011–2049` `3162–3175` `4429–4467` `4592–4648` | `public/js/bloom.js` `public/js/textures.js` `public/js/vao.js` `public/js/stylize.js` `public/js/gpuparticles.js` |
| **UI / HUD / MENU** | `1363–1408` `3114–3136` `3152–3161` `3176–3192` `4142–4220` `4270–4323` `4339–4402` `8072–8135` `8166–8214` `8250–8337` | `public/js/main.js` `public/style.css` `src/pages/index.astro` |
| **ÁUDIO** | — | `public/js/audio.js` |
| **PERSONAGENS** | — | `public/js/characters.js` `public/js/glbchars.js` |
| **SITE / BACKEND** | — | `src/` `supabase/` |

**🔴 Zonas vermelhas (append-only, qualquer frente pode precisar):** `update()` 8338–8427 · `_dom()` 1363–1408 · `constructor()` 726–1362

Nenhuma sobreposição entre frentes — todas as faixas são disjuntas. ✓

Cobertura: **3927 de 8480 linhas (46%)** do `game.js` têm dono declarado. O resto é território neutro — declare a frente mesmo assim.

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
| 1409 | `_buildEnv()` | 54 |
| 1463 | `_buildViewModels()` | 269 |
| 1732 | `_vmFrame` | 141 |
| 1873 | `_vmMontarTardio` | 14 |
| 1887 | `_makePuffTexture()` | 10 |
| 1897 | `_makeBloodTex()` | 19 |
| 1916 | `_makeBloodPoolTex()` | 21 |
| 1937 | `_bloodDecal()` | 16 |
| 1953 | `_makeBloodFx()` | 20 |
| 1973 | `_bloodSpatter()` | 18 |
| 1991 | `_bloodPoolAt()` | 6 |
| 1997 | `_updateBlood()` | 14 |
| 2011 | `_makeFlashTex()` | 21 |
| 2032 | `_makeFlashSoftTex()` | 8 |
| 2040 | `_makeFlashCoreTex()` | 10 |
| 2050 | `_input()` | 6 |
| 2056 | `_kd` | 49 |
| 2105 | `_ku` | 5 |
| 2110 | `_md` | 40 |
| 2150 | `_mu` | 7 |
| 2157 | `_mm` | 20 |
| 2177 | `_wh` | 17 |
| 2194 | `_cc` | 1 |
| 2195 | `_blur` | 1 |
| 2196 | `_plc` | 19 |
| 2215 | `_touchControls()` | 135 |
| 2350 | `_aimAssist()` | 28 |
| 2378 | `_requestLock()` | 27 |
| 2405 | `_travaAtalhos()` | 4 |
| 2409 | `_soltaAtalhos()` | 5 |
| 2414 | `espectando()` | 2 |
| 2416 | `_acceptInput()` | 7 |
| 2423 | `travarEntrada()` | 17 |
| 2440 | `_chatSeguraPausa()` | 5 |
| 2445 | `_pauseBackdrop()` | 7 |
| 2452 | `_radioShow()` | 6 |
| 2458 | `_radioUi()` | 8 |
| 2466 | `_radioPick()` | 20 |
| 2486 | `_abilityNotice()` | 10 |
| 2496 | `_resetSliceAbilities()` | 9 |
| 2505 | `_stackTrace()` | 28 |
| 2533 | `_updateMotocaCharge()` | 10 |
| 2543 | `_recordRoutePoint()` | 11 |
| 2554 | `_routePing()` | 23 |
| 2577 | `_tickRoutePings()` | 12 |
| 2589 | `_objectiveInteractionMultiplier()` | 14 |
| 2603 | `start()` | 5 |
| 2608 | `_startAnnouncerLab()` | 9 |
| 2617 | `_startRound()` | 38 |
| 2655 | `_resetPositions()` | 255 |
| 2910 | `_checkCtfAlvo()` | 13 |
| 2923 | `_checkPace()` | 13 |
| 2936 | `_endRound()` | 34 |
| 2970 | `_roundWinnerVoice()` | 12 |
| 2982 | `_fimDaPartida()` | 7 |
| 2989 | `_endMatch()` | 61 |
| 3050 | `_ensureDolly()` | 41 |
| 3091 | `_tickDolly()` | 23 |
| 3114 | `setPaused()` | 23 |
| 3137 | `_now()` | 3 |
| 3140 | `pauseArmed()` | 1 |
| 3141 | `_syncPauseArm()` | 7 |
| 3148 | `resume()` | 4 |
| 3152 | `applySettings()` | 10 |
| 3162 | `_applyQuality()` | 14 |
| 3176 | `onResize()` | 17 |
| 3193 | `_switchTeam()` | 66 |
| 3259 | `_applyVmVisibility()` | 34 |
| 3293 | `_ensureVmPrecisionQa()` | 79 |
| 3372 | `_syncVmPresentation()` | 19 |
| 3391 | `_vmlabEnsure()` | 14 |
| 3405 | `_vmlabFrame()` | 28 |
| 3433 | `_tuneGet()` | 15 |
| 3448 | `_tune()` | 23 |
| 3471 | `_fxSet()` | 2 |
| 3473 | `_qaCicloArma()` | 8 |
| 3481 | `_cycleWeapon()` | 8 |
| 3489 | `_switchWeapon()` | 39 |
| 3528 | `_deploySfx()` | 7 |
| 3535 | `_scope()` | 17 |
| 3552 | `_zoomFov()` | 5 |
| 3557 | `_reloading()` | 1 |
| 3558 | `_startReload()` | 25 |
| 3583 | `_reloadLayers()` | 18 |
| 3601 | `_installRecoil()` | 33 |
| 3634 | `_shotRecoil()` | 13 |
| 3647 | `_tryShoot()` | 82 |
| 3729 | `_tryKnifeAttack()` | 14 |
| 3743 | `_meleeHit()` | 16 |
| 3759 | `_meleeRange()` | 5 |
| 3764 | `_botMelee()` | 28 |
| 3792 | `_shotDamage()` | 11 |
| 3803 | `_fireHitscan()` | 70 |
| 3873 | `_targetFromHit()` | 9 |
| 3882 | `_penetrationExit()` | 20 |
| 3902 | `_surfaceOf()` | 27 |
| 3929 | `_armoredTarget()` | 3 |
| 3932 | `_fleshImpact()` | 38 |
| 3970 | `_fxVoice()` | 9 |
| 3979 | `_impactSfx()` | 17 |
| 3996 | `_tintFx()` | 16 |
| 4012 | `_damage()` | 42 |
| 4054 | `_playerHurtFx()` | 5 |
| 4059 | `_kill()` | 53 |
| 4112 | `_checkArenaWin()` | 30 |
| 4142 | `_dmgArc()` | 79 |
| 4221 | `_mkBanner()` | 9 |
| 4230 | `_updateKillSequenceHud()` | 12 |
| 4242 | `_resetKillSequence()` | 5 |
| 4247 | `_playerKillFeedback()` | 18 |
| 4265 | `_acertoPrevisto()` | 5 |
| 4270 | `_hitmarker()` | 15 |
| 4285 | `_dmgNumber()` | 20 |
| 4305 | `_feed()` | 19 |
| 4324 | `_skullIcon()` | 6 |
| 4330 | `_killfeedWeaponIcon()` | 9 |
| 4339 | `_wpnIcon()` | 64 |
| 4403 | `_tracer()` | 26 |
| 4429 | `_puff()` | 39 |
| 4468 | `_holeDecalMat()` | 8 |
| 4476 | `_flash()` | 61 |
| 4537 | `_vmTetoTela()` | 10 |
| 4547 | `_muzzleWorld()` | 30 |
| 4577 | `_aimOrigin()` | 5 |
| 4582 | `_updateDoors()` | 10 |
| 4592 | `_updateFx()` | 57 |
| 4649 | `_ejectCasing()` | 17 |
| 4666 | `_makeCtfFlagTex()` | 23 |
| 4689 | `_paintFlagSymbol()` | 9 |
| 4698 | `_flagTexFor()` | 26 |
| 4724 | `_legadoSimbolo()` | 8 |
| 4732 | `_loadCtfSymbols()` | 22 |
| 4754 | `_makeCtfZoneTex()` | 31 |
| 4785 | `_makeSmokeTex()` | 10 |
| 4795 | `_updateSmokeHud()` | 4 |
| 4799 | `_grenadeSpatial()` | 14 |
| 4813 | `_spawnGrenade()` | 19 |
| 4832 | `_throwNade()` | 13 |
| 4845 | `_throwSmoke()` | 1 |
| 4846 | `_throwFrag()` | 4 |
| 4850 | `_explodeFrag()` | 40 |
| 4890 | `_corDaFumaca()` | 16 |
| 4906 | `_popSmoke()` | 23 |
| 4929 | `_updateGrenades()` | 35 |
| 4964 | `_teamColor()` | 15 |
| 4979 | `_teamInk()` | 7 |
| 4986 | `_factionOf()` | 1 |
| 4987 | `_voiceKey()` | 1 |
| 4988 | `_teamName()` | 1 |
| 4989 | `_teamTag()` | 6 |
| 4995 | `_plaqueta()` | 13 |
| 5008 | `_mirror()` | 2 |
| 5010 | `_defNoLado()` | 3 |
| 5013 | `_botSeparation()` | 61 |
| 5074 | `_initCTF()` | 86 |
| 5160 | `_updateCTF()` | 61 |
| 5221 | `_ctfWin()` | 24 |
| 5245 | `_freeYaw()` | 25 |
| 5270 | `_pullString()` | 23 |
| 5293 | `_walkReach()` | 32 |
| 5325 | `_wpComp()` | 16 |
| 5341 | `_findPathLocal()` | 22 |
| 5363 | `_botCtf()` | 137 |
| 5500 | `_hideCtfHud()` | 6 |
| 5506 | `_updateCtfHud()` | 76 |
| 5582 | `_collide()` | 23 |
| 5605 | `_collideRot()` | 22 |
| 5627 | `_mantleAlcance()` | 50 |
| 5677 | `_mantleAlcancavel()` | 12 |
| 5689 | `_mantleTarget()` | 35 |
| 5724 | `_freeSpot()` | 30 |
| 5754 | `_retaAndavel()` | 20 |
| 5774 | `_walkDepth()` | 16 |
| 5790 | `_noteHit()` | 17 |
| 5807 | `_deathFeedback()` | 45 |
| 5852 | `_toggleCamView()` | 6 |
| 5858 | `setCamView()` | 16 |
| 5874 | `_syncCamViewVis()` | 8 |
| 5882 | `_ensurePlayerTP()` | 26 |
| 5908 | `_updatePlayerTP()` | 42 |
| 5950 | `_updateCrosshairParallax()` | 47 |
| 5997 | `_tpDeath()` | 18 |
| 6015 | `_tpRevive()` | 13 |
| 6028 | `_moveEntity()` | 101 |
| 6129 | `_updatePlayer()` | 308 |
| 6437 | `_footstepSurface()` | 13 |
| 6450 | `_updatePickups()` | 158 |
| 6608 | `_wpnMode()` | 5 |
| 6613 | `_botWeapon()` | 10 |
| 6623 | `_municaoInfinita()` | 1 |
| 6624 | `_pickupAllowed()` | 9 |
| 6633 | `_grabNearPickup()` | 10 |
| 6643 | `_grabPickup()` | 35 |
| 6678 | `_assentarNoChao()` | 10 |
| 6688 | `refreshPickupModels()` | 24 |
| 6712 | `_dropWeapon()` | 20 |
| 6732 | `_sumirDrop()` | 36 |
| 6768 | `_spawnY()` | 3 |
| 6771 | `_spawnYaw()` | 5 |
| 6776 | `_pickSpawn()` | 23 |
| 6799 | `_respawnPlayer()` | 34 |
| 6833 | `_losClear()` | 18 |
| 6851 | `_botCall()` | 41 |
| 6892 | `_teamMarkTex()` | 23 |
| 6915 | `_makeTeamMark()` | 16 |
| 6931 | `_trocarPersonagem()` | 18 |
| 6949 | `_syncRemoteWeapon()` | 23 |
| 6972 | `_updateTeamMark()` | 7 |
| 6979 | `_botEye()` | 1 |
| 6980 | `_enemyOf()` | 8 |
| 6988 | `_duelToken()` | 22 |
| 7010 | `_respawnEntity()` | 22 |
| 7032 | `_botOuve()` | 12 |
| 7044 | `_updateBot()` | 858 |
| 7902 | `_flushTraining()` | 13 |
| 7915 | `_updateBotNN()` | 73 |
| 7988 | `_botShootNN()` | 46 |
| 8034 | `_radarFoot()` | 38 |
| 8072 | `_updateRadar()` | 64 |
| 8136 | `_banner()` | 26 |
| 8162 | `_resultadoDaRodada()` | 4 |
| 8166 | `_showScoreboard()` | 49 |
| 8215 | `_updateWeaponHud()` | 35 |
| 8250 | `_updateHud()` | 88 |
| 8338 | `update()` | 90 |
| 8428 | `dispose()` | 52 |

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
