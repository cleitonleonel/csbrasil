# ARCH.md — mapa de arquitetura e de CONFLITO (CS BRASIL / CORO SOLTO)

<!-- BEGIN:GERADO — não edite à mão, rode `npm run arch` -->

> Gerado por `node tools/gen-arch.mjs`. **Não edite este bloco à mão.**
> Versão do jogo: 2.1.0-alpha.101 · `npm run arch` para regenerar · `npm run arch:check` no CI.

## Tamanho dos arquivos indexados

| Arquivo | Linhas | Símbolos |
|---|---:|---:|
| `public/js/game.js` | 8577 | 351 |
| `public/js/main.js` | 4891 | 360 |
| `public/js/glbchars.js` | 893 | 62 |
| `public/js/characters.js` | 1143 | 42 |
| `public/js/vmattach.js` | 633 | 4 |
| `public/js/springs.js` | 260 | 28 |
| `public/js/weapons.js` | 354 | 22 |

## Maiores métodos de `game.js` — onde o conflito mora

Os 15 maiores somam **3358 linhas (39% do arquivo)**. Método grande = PR irrevisável e merge conflitante.

| Linhas | Início | Método | |
|---:|---:|---|---|
| 837 | 7176 | `_updateBot()` | ⚠️ candidato a extração |
| 639 | 725 | `constructor()` | 🔴 append-only |
| 308 | 6253 | `_updatePlayer()` | ⚠️ candidato a extração |
| 271 | 1467 | `_buildViewModels()` |  |
| 266 | 2665 | `_resetPositions()` |  |
| 158 | 6574 | `_updatePickups()` |  |
| 137 | 5456 | `_botCtf()` |  |
| 135 | 2221 | `_touchControls()` |  |
| 101 | 6152 | `_moveEntity()` |  |
| 90 | 8435 | `update()` | 🔴 append-only |
| 88 | 8347 | `_updateHud()` |  |
| 86 | 5167 | `_initCTF()` |  |
| 84 | 3667 | `_tryShoot()` |  |
| 79 | 3314 | `_ensureVmPrecisionQa()` |  |
| 79 | 4229 | `_dmgArc()` |  |

## Tabela de CONFLITO — resolvida para as linhas de hoje

Declare sua frente antes de editar. Em `game.js` use **só a ferramenta Edit, nunca Write**.
Duas frentes com faixas disjuntas podem rodar em paralelo — foi medido: 3 agentes editaram
faixas disjuntas simultaneamente com zero conflito de conteúdo.

| Frente | Faixas em `game.js` | Arquivos exclusivos |
|---|---|---|
| **ARMAS / VIEWMODEL** | `363–366` `438–532` `562–583` `1467–1878` `3280–3313` `3510–3602` `3621–3750` `3765–3780` `3925–3970` `4499–4524` `4572–4672` `4745–4761` | `public/js/vmattach.js` `public/js/springs.js` `public/js/weapons.js` `public/js/fparms.js` `public/js/handik.js` `public/js/recoil.js` `public/js/vmlab.js` |
| **BOTS / JOGABILIDADE** | `195–198` `249–249` `282–293` `625–636` `4098–4198` `5106–5166` `5338–5592` `5675–5697` `6253–6560` `6959–6976` `7110–7140` `7176–8012` | — |
| **MAPAS / MUNDO** | `1410–1466` `2665–2930` `5167–5313` `6574–6731` | `public/js/maps.js` `public/js/mapprops.js` `public/js/map_brasilia.js` `public/js/map_havan.js` `public/js/map_piscina.js` `public/js/map_piscinao_ramos.js` `public/js/map_ferrovelho.js` |
| **GRÁFICOS / FX** | `1893–1902` `2017–2055` `3183–3196` `4525–4563` `4688–4744` | `public/js/bloom.js` `public/js/textures.js` `public/js/vao.js` `public/js/stylize.js` `public/js/gpuparticles.js` |
| **UI / HUD / MENU** | `1364–1409` `3135–3157` `3173–3182` `3197–3213` `4229–4307` `4366–4419` `4435–4498` `8168–8232` `8263–8311` `8347–8434` | `public/js/main.js` `public/style.css` `src/pages/index.astro` |
| **ÁUDIO** | — | `public/js/audio.js` |
| **PERSONAGENS** | — | `public/js/characters.js` `public/js/glbchars.js` |
| **SITE / BACKEND** | — | `src/` `supabase/` |

**🔴 Zonas vermelhas (append-only, qualquer frente pode precisar):** `update()` 8435–8524 · `_dom()` 1364–1409 · `constructor()` 725–1363

Nenhuma sobreposição entre frentes — todas as faixas são disjuntas. ✓

Cobertura: **3901 de 8577 linhas (45%)** do `game.js` têm dono declarado. O resto é território neutro — declare a frente mesmo assim.

<details><summary><strong>Índice completo de <code>game.js</code> (todos os símbolos)</strong></summary>

| Linha | Símbolo | Linhas |
|---:|---|---:|
| 56 | `ANNOUNCER_LAB` | 4 |
| 60 | `VMLAB` | 3 |
| 65 | `VM_QA_CICLO` | 3 |
| 69 | `VM_QA_ADS` | 8 |
| 77 | `VM_MAT_LEGACY` | 4 |
| 85 | `RECUPERA_BOOM` | 8 |
| 93 | `ROUNDS_MAX` | 27 |
| 121 | `CTF_ROUNDS_TO_WIN` | 4 |
| 126 | `sanitizeRounds` | 4 |
| 131 | `CTF_CLOCK_SHOW` | 4 |
| 135 | `KILLS_PER_PLAYER` | 7 |
| 142 | `PACE` | 33 |
| 175 | `PAUSE_ARM_MS` | 3 |
| 178 | `CHAT_PAUSA_GUARDA_MS` | 9 |
| 188 | `confirmGate` | 7 |
| 199 | `BOT_AIM_PITCH` | 4 |
| 203 | `BOT_DMG_PLAYER` | 21 |
| 224 | `BOT_FAIR` | 5 |
| 229 | `BOT_MOVE2` | 15 |
| 253 | `BOT_FOCUS_MIN` | 3 |
| 260 | `BOT_OUVE_PASSO` | 22 |
| 286 | `BOT_TOKEN_REST` | 7 |
| 294 | `MOVE_MUL` | 6 |
| 301 | `MOVE2` | 4 |
| 305 | `STEP_H` | 3 |
| 312 | `MANTLE_APOIO` | 4 |
| 316 | `MANTLE_GRID` | 5 |
| 321 | `RACK_OLD` | 4 |
| 325 | `RACK_RETA` | 25 |
| 352 | `RADIO` | 5 |
| 358 | `MK_LABELS` | 5 |
| 363 | `GUNFEEL` | 4 |
| 370 | `TRACER_STYLE` | 6 |
| 380 | `ADS_RAMPA_S` | 3 |
| 384 | `aberturaCone` | 16 |
| 400 | `anguloDeDisparo` | 4 |
| 404 | `coneDoDisparo` | 16 |
| 421 | `D2R` | 4 |
| 425 | `DMG_FALLOFF` | 5 |
| 430 | `HS_MUL` | 3 |
| 433 | `BALL_CLASS` | 5 |
| 438 | `STATIC_CLASS` | 75 |
| 514 | `VM_KNOB` | 19 |
| 533 | `vmAdsRot` | 4 |
| 538 | `vmFovForAspect` | 24 |
| 562 | `VM_OFF` | 22 |
| 584 | `vmOffY` | 35 |
| 619 | `VMP` | 6 |
| 625 | `BOT_SKILLS` | 11 |
| 637 | `diffKey` | 4 |
| 642 | `rollBotSkill` | 7 |
| 649 | `botTier` | 4 |
| 653 | `_cyclePool` | 5 |
| 658 | `_rosterPool` | 22 |
| 682 | `_pinnedDefs` | 5 |
| 687 | `pickMatchRoster` | 21 |
| 708 | `BOT_WEAPON_POOL` | 5 |
| 713 | `pickMatchWeapons` | 9 |
| 725 | `constructor()` | 639 |
| 1364 | `_dom()` | 46 |
| 1410 | `_buildEnv()` | 57 |
| 1467 | `_buildViewModels()` | 271 |
| 1738 | `_vmFrame` | 141 |
| 1879 | `_vmMontarTardio` | 14 |
| 1893 | `_makePuffTexture()` | 10 |
| 1903 | `_makeBloodTex()` | 19 |
| 1922 | `_makeBloodPoolTex()` | 21 |
| 1943 | `_bloodDecal()` | 16 |
| 1959 | `_makeBloodFx()` | 20 |
| 1979 | `_bloodSpatter()` | 18 |
| 1997 | `_bloodPoolAt()` | 6 |
| 2003 | `_updateBlood()` | 14 |
| 2017 | `_makeFlashTex()` | 21 |
| 2038 | `_makeFlashSoftTex()` | 8 |
| 2046 | `_makeFlashCoreTex()` | 10 |
| 2056 | `_input()` | 6 |
| 2062 | `_kd` | 49 |
| 2111 | `_ku` | 5 |
| 2116 | `_md` | 40 |
| 2156 | `_mu` | 7 |
| 2163 | `_mm` | 20 |
| 2183 | `_wh` | 17 |
| 2200 | `_cc` | 1 |
| 2201 | `_blur` | 1 |
| 2202 | `_plc` | 19 |
| 2221 | `_touchControls()` | 135 |
| 2356 | `_aimAssist()` | 28 |
| 2384 | `_requestLock()` | 27 |
| 2411 | `_travaAtalhos()` | 4 |
| 2415 | `_soltaAtalhos()` | 5 |
| 2420 | `espectando()` | 2 |
| 2422 | `_acceptInput()` | 7 |
| 2429 | `travarEntrada()` | 17 |
| 2446 | `_chatSeguraPausa()` | 5 |
| 2451 | `_pauseBackdrop()` | 7 |
| 2458 | `_radioShow()` | 6 |
| 2464 | `_radioUi()` | 8 |
| 2472 | `_radioPick()` | 20 |
| 2492 | `_abilityNotice()` | 10 |
| 2502 | `_resetSliceAbilities()` | 9 |
| 2511 | `_stackTrace()` | 28 |
| 2539 | `_updateMotocaCharge()` | 10 |
| 2549 | `_recordRoutePoint()` | 11 |
| 2560 | `_routePing()` | 23 |
| 2583 | `_tickRoutePings()` | 12 |
| 2595 | `_objectiveInteractionMultiplier()` | 14 |
| 2609 | `start()` | 5 |
| 2614 | `_startAnnouncerLab()` | 9 |
| 2623 | `_startRound()` | 42 |
| 2665 | `_resetPositions()` | 266 |
| 2931 | `_checkCtfAlvo()` | 13 |
| 2944 | `_checkPace()` | 13 |
| 2957 | `_endRound()` | 34 |
| 2991 | `_roundWinnerVoice()` | 12 |
| 3003 | `_fimDaPartida()` | 7 |
| 3010 | `_endMatch()` | 61 |
| 3071 | `_ensureDolly()` | 41 |
| 3112 | `_tickDolly()` | 23 |
| 3135 | `setPaused()` | 23 |
| 3158 | `_now()` | 3 |
| 3161 | `pauseArmed()` | 1 |
| 3162 | `_syncPauseArm()` | 7 |
| 3169 | `resume()` | 4 |
| 3173 | `applySettings()` | 10 |
| 3183 | `_applyQuality()` | 14 |
| 3197 | `onResize()` | 17 |
| 3214 | `_switchTeam()` | 66 |
| 3280 | `_applyVmVisibility()` | 34 |
| 3314 | `_ensureVmPrecisionQa()` | 79 |
| 3393 | `_syncVmPresentation()` | 19 |
| 3412 | `_vmlabEnsure()` | 14 |
| 3426 | `_vmlabFrame()` | 28 |
| 3454 | `_tuneGet()` | 15 |
| 3469 | `_tune()` | 23 |
| 3492 | `_fxSet()` | 2 |
| 3494 | `_qaCicloArma()` | 8 |
| 3502 | `_cycleWeapon()` | 8 |
| 3510 | `_switchWeapon()` | 38 |
| 3548 | `_deploySfx()` | 7 |
| 3555 | `_scope()` | 17 |
| 3572 | `_zoomFov()` | 5 |
| 3577 | `_reloading()` | 1 |
| 3578 | `_startReload()` | 25 |
| 3603 | `_reloadLayers()` | 18 |
| 3621 | `_installRecoil()` | 33 |
| 3654 | `_shotRecoil()` | 13 |
| 3667 | `_tryShoot()` | 84 |
| 3751 | `_tryKnifeAttack()` | 14 |
| 3765 | `_meleeHit()` | 16 |
| 3781 | `_meleeRange()` | 5 |
| 3786 | `_botMelee()` | 26 |
| 3812 | `_distanceDamage()` | 7 |
| 3819 | `_shotDamage()` | 10 |
| 3829 | `_consultarTiro()` | 13 |
| 3842 | `_origemTiroBot()` | 4 |
| 3846 | `_miraTiroBot()` | 5 |
| 3851 | `_participanteHumano()` | 4 |
| 3855 | `_resolverTiroBot()` | 11 |
| 3866 | `_danoTiroBot()` | 12 |
| 3878 | `_aplicarTiroBot()` | 12 |
| 3890 | `_dispararBot()` | 29 |
| 3919 | `_rastroTiroBot()` | 6 |
| 3925 | `_fireHitscan()` | 46 |
| 3971 | `_targetFromHit()` | 9 |
| 3980 | `_penetrationExit()` | 8 |
| 3988 | `_surfaceOf()` | 27 |
| 4015 | `_armoredTarget()` | 3 |
| 4018 | `_fleshImpact()` | 38 |
| 4056 | `_fxVoice()` | 9 |
| 4065 | `_impactSfx()` | 17 |
| 4082 | `_tintFx()` | 16 |
| 4098 | `_damage()` | 42 |
| 4140 | `_playerHurtFx()` | 5 |
| 4145 | `_kill()` | 54 |
| 4199 | `_checkArenaWin()` | 30 |
| 4229 | `_dmgArc()` | 79 |
| 4308 | `_mkBanner()` | 9 |
| 4317 | `_updateKillSequenceHud()` | 12 |
| 4329 | `_resetKillSequence()` | 7 |
| 4336 | `_fragRestockStep()` | 7 |
| 4343 | `_playerKillFeedback()` | 18 |
| 4361 | `_acertoPrevisto()` | 5 |
| 4366 | `_hitmarker()` | 15 |
| 4381 | `_dmgNumber()` | 20 |
| 4401 | `_feed()` | 19 |
| 4420 | `_skullIcon()` | 6 |
| 4426 | `_killfeedWeaponIcon()` | 9 |
| 4435 | `_wpnIcon()` | 64 |
| 4499 | `_tracer()` | 26 |
| 4525 | `_puff()` | 39 |
| 4564 | `_holeDecalMat()` | 8 |
| 4572 | `_flash()` | 61 |
| 4633 | `_vmTetoTela()` | 10 |
| 4643 | `_muzzleWorld()` | 30 |
| 4673 | `_aimOrigin()` | 5 |
| 4678 | `_updateDoors()` | 10 |
| 4688 | `_updateFx()` | 57 |
| 4745 | `_ejectCasing()` | 17 |
| 4762 | `_makeCtfFlagTex()` | 23 |
| 4785 | `_paintFlagSymbol()` | 9 |
| 4794 | `_flagTexFor()` | 25 |
| 4819 | `_legadoSimbolo()` | 8 |
| 4827 | `_loadCtfSymbols()` | 22 |
| 4849 | `_makeCtfZoneTex()` | 31 |
| 4880 | `_makeSmokeTex()` | 10 |
| 4890 | `_updateSmokeHud()` | 4 |
| 4894 | `_grenadeSpatial()` | 14 |
| 4908 | `_spawnGrenade()` | 19 |
| 4927 | `_throwNade()` | 13 |
| 4940 | `_throwSmoke()` | 1 |
| 4941 | `_throwFrag()` | 4 |
| 4945 | `_explodeFrag()` | 40 |
| 4985 | `_corDaFumaca()` | 16 |
| 5001 | `_popSmoke()` | 23 |
| 5024 | `_updateGrenades()` | 35 |
| 5059 | `_teamColor()` | 12 |
| 5071 | `_teamInk()` | 7 |
| 5078 | `_factionOf()` | 1 |
| 5079 | `_voiceKey()` | 2 |
| 5081 | `_teamName()` | 1 |
| 5082 | `_teamTag()` | 6 |
| 5088 | `_plaqueta()` | 13 |
| 5101 | `_mirror()` | 2 |
| 5103 | `_defNoLado()` | 3 |
| 5106 | `_botSeparation()` | 61 |
| 5167 | `_initCTF()` | 86 |
| 5253 | `_updateCTF()` | 61 |
| 5314 | `_ctfWin()` | 24 |
| 5338 | `_freeYaw()` | 25 |
| 5363 | `_pullString()` | 23 |
| 5386 | `_walkReach()` | 32 |
| 5418 | `_wpComp()` | 16 |
| 5434 | `_findPathLocal()` | 22 |
| 5456 | `_botCtf()` | 137 |
| 5593 | `_hideCtfHud()` | 6 |
| 5599 | `_updateCtfHud()` | 76 |
| 5675 | `_collide()` | 23 |
| 5698 | `_collideRot()` | 22 |
| 5720 | `_mantleAlcance()` | 50 |
| 5770 | `_mantleAlcancavel()` | 12 |
| 5782 | `_mantleTarget()` | 35 |
| 5817 | `_freeSpot()` | 30 |
| 5847 | `_retaAndavel()` | 20 |
| 5867 | `_walkDepth()` | 16 |
| 5883 | `_noteHit()` | 17 |
| 5900 | `_deathFeedback()` | 45 |
| 5945 | `_toggleCamView()` | 6 |
| 5951 | `setCamView()` | 16 |
| 5967 | `_syncCamViewVis()` | 8 |
| 5975 | `_ensurePlayerTP()` | 26 |
| 6001 | `_updatePlayerTP()` | 73 |
| 6074 | `_updateCrosshairParallax()` | 47 |
| 6121 | `_tpDeath()` | 18 |
| 6139 | `_tpRevive()` | 13 |
| 6152 | `_moveEntity()` | 101 |
| 6253 | `_updatePlayer()` | 308 |
| 6561 | `_footstepSurface()` | 13 |
| 6574 | `_updatePickups()` | 158 |
| 6732 | `_wpnMode()` | 7 |
| 6739 | `_botWeapon()` | 10 |
| 6749 | `_municaoInfinita()` | 1 |
| 6750 | `_pickupAllowed()` | 9 |
| 6759 | `_grabNearPickup()` | 10 |
| 6769 | `_grabPickup()` | 35 |
| 6804 | `_assentarNoChao()` | 10 |
| 6814 | `refreshPickupModels()` | 24 |
| 6838 | `_dropWeapon()` | 20 |
| 6858 | `_sumirDrop()` | 36 |
| 6894 | `_spawnY()` | 3 |
| 6897 | `_spawnYaw()` | 5 |
| 6902 | `_pickSpawn()` | 23 |
| 6925 | `_respawnPlayer()` | 34 |
| 6959 | `_losClear()` | 18 |
| 6977 | `_botCall()` | 41 |
| 7018 | `_teamMarkTex()` | 23 |
| 7041 | `_makeTeamMark()` | 16 |
| 7057 | `_trocarPersonagem()` | 19 |
| 7076 | `_syncRemoteWeapon()` | 23 |
| 7099 | `_updateTeamMark()` | 7 |
| 7106 | `_posturaBot()` | 4 |
| 7110 | `_botEye()` | 1 |
| 7111 | `_enemyOf()` | 8 |
| 7119 | `_duelToken()` | 22 |
| 7141 | `_respawnEntity()` | 23 |
| 7164 | `_botOuve()` | 12 |
| 7176 | `_updateBot()` | 837 |
| 8013 | `_flushTraining()` | 13 |
| 8026 | `_updateBotNN()` | 73 |
| 8099 | `_botShootNN()` | 31 |
| 8130 | `_radarFoot()` | 38 |
| 8168 | `_updateRadar()` | 65 |
| 8233 | `_banner()` | 26 |
| 8259 | `_resultadoDaRodada()` | 4 |
| 8263 | `_showScoreboard()` | 49 |
| 8312 | `_updateWeaponHud()` | 35 |
| 8347 | `_updateHud()` | 88 |
| 8435 | `update()` | 90 |
| 8525 | `dispose()` | 52 |

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
