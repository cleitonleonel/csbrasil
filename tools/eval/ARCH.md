# ARCH.md — mapa de arquitetura e de CONFLITO (CS BRASIL / CORO SOLTO)

<!-- BEGIN:GERADO — não edite à mão, rode `npm run arch` -->

> Gerado por `node tools/gen-arch.mjs`. **Não edite este bloco à mão.**
> Versão do jogo: 2.1.0-alpha.76 · `npm run arch` para regenerar · `npm run arch:check` no CI.

## Tamanho dos arquivos indexados

| Arquivo | Linhas | Símbolos |
|---|---:|---:|
| `public/js/game.js` | 8433 | 332 |
| `public/js/main.js` | 4504 | 336 |
| `public/js/glbchars.js` | 855 | 60 |
| `public/js/characters.js` | 1143 | 42 |
| `public/js/vmattach.js` | 633 | 4 |
| `public/js/springs.js` | 260 | 28 |
| `public/js/weapons.js` | 354 | 22 |

## Maiores métodos de `game.js` — onde o conflito mora

Os 15 maiores somam **3337 linhas (40% do arquivo)**. Método grande = PR irrevisável e merge conflitante.

| Linhas | Início | Método | |
|---:|---:|---|---|
| 838 | 7018 | `_updateBot()` | ⚠️ candidato a extração |
| 637 | 718 | `constructor()` | 🔴 append-only |
| 304 | 6120 | `_updatePlayer()` | ⚠️ candidato a extração |
| 269 | 1455 | `_buildViewModels()` |  |
| 255 | 2647 | `_resetPositions()` |  |
| 158 | 6437 | `_updatePickups()` |  |
| 137 | 5354 | `_botCtf()` |  |
| 135 | 2207 | `_touchControls()` |  |
| 101 | 6019 | `_moveEntity()` |  |
| 90 | 8292 | `update()` | 🔴 append-only |
| 88 | 8204 | `_updateHud()` |  |
| 86 | 5065 | `_initCTF()` |  |
| 81 | 3638 | `_tryShoot()` |  |
| 79 | 3284 | `_ensureVmPrecisionQa()` |  |
| 79 | 4133 | `_dmgArc()` |  |

## Tabela de CONFLITO — resolvida para as linhas de hoje

Declare sua frente antes de editar. Em `game.js` use **só a ferramenta Edit, nunca Write**.
Duas frentes com faixas disjuntas podem rodar em paralelo — foi medido: 3 agentes editaram
faixas disjuntas simultaneamente com zero conflito de conteúdo.

| Frente | Faixas em `game.js` | Arquivos exclusivos |
|---|---|---|
| **ARMAS / VIEWMODEL** | `346–349` `431–525` `555–576` `1455–1864` `3250–3283` `3480–3573` `3592–3718` `3733–3748` `3793–3862` `4394–4419` `4467–4567` `4640–4656` | `public/js/vmattach.js` `public/js/springs.js` `public/js/weapons.js` `public/js/fparms.js` `public/js/handik.js` `public/js/recoil.js` `public/js/vmlab.js` |
| **BOTS / JOGABILIDADE** | `185–188` `239–239` `265–276` `618–629` `4002–4102` `5004–5064` `5236–5490` `5573–5595` `6120–6423` `6820–6837` `6966–6996` `7018–7855` | — |
| **MAPAS / MUNDO** | `1401–1454` `2647–2901` `5065–5211` `6437–6594` | `public/js/maps.js` `public/js/mapprops.js` `public/js/map_brasilia.js` `public/js/map_havan.js` `public/js/map_piscina.js` `public/js/map_piscinao_ramos.js` `public/js/map_ferrovelho.js` |
| **GRÁFICOS / FX** | `1879–1888` `2003–2041` `3154–3166` `4420–4458` `4583–4639` | `public/js/bloom.js` `public/js/textures.js` `public/js/vao.js` `public/js/stylize.js` `public/js/gpuparticles.js` |
| **UI / HUD / MENU** | `1355–1400` `3106–3128` `3144–3153` `3167–3183` `4133–4211` `4261–4314` `4330–4393` `8026–8089` `8120–8168` `8204–8291` | `public/js/main.js` `public/style.css` `src/pages/index.astro` |
| **ÁUDIO** | — | `public/js/audio.js` |
| **PERSONAGENS** | — | `public/js/characters.js` `public/js/glbchars.js` |
| **SITE / BACKEND** | — | `src/` `supabase/` |

**🔴 Zonas vermelhas (append-only, qualquer frente pode precisar):** `update()` 8292–8381 · `_dom()` 1355–1400 · `constructor()` 718–1354

Nenhuma sobreposição entre frentes — todas as faixas são disjuntas. ✓

Cobertura: **3901 de 8433 linhas (46%)** do `game.js` têm dono declarado. O resto é território neutro — declare a frente mesmo assim.

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
| 111 | `CTF_ROUNDS_TO_WIN` | 4 |
| 116 | `sanitizeRounds` | 4 |
| 121 | `CTF_CLOCK_SHOW` | 4 |
| 125 | `KILLS_PER_PLAYER` | 7 |
| 132 | `PACE` | 33 |
| 165 | `PAUSE_ARM_MS` | 3 |
| 168 | `CHAT_PAUSA_GUARDA_MS` | 9 |
| 178 | `confirmGate` | 7 |
| 189 | `BOT_AIM_PITCH` | 4 |
| 193 | `BOT_DMG_PLAYER` | 21 |
| 214 | `BOT_FAIR` | 5 |
| 219 | `BOT_MOVE2` | 15 |
| 243 | `BOT_FOCUS_MIN` | 22 |
| 269 | `BOT_TOKEN_REST` | 7 |
| 277 | `MOVE_MUL` | 6 |
| 284 | `MOVE2` | 4 |
| 288 | `STEP_H` | 3 |
| 295 | `MANTLE_APOIO` | 4 |
| 299 | `MANTLE_GRID` | 5 |
| 304 | `RACK_OLD` | 4 |
| 308 | `RACK_RETA` | 25 |
| 335 | `RADIO` | 5 |
| 341 | `MK_LABELS` | 5 |
| 346 | `GUNFEEL` | 4 |
| 353 | `TRACER_STYLE` | 6 |
| 363 | `ADS_RAMPA_S` | 3 |
| 367 | `aberturaCone` | 16 |
| 383 | `anguloDeDisparo` | 4 |
| 387 | `coneDoDisparo` | 16 |
| 404 | `D2R` | 4 |
| 408 | `DMG_FALLOFF` | 5 |
| 413 | `HS_MUL` | 3 |
| 416 | `BALL_CLASS` | 15 |
| 431 | `STATIC_CLASS` | 75 |
| 507 | `VM_KNOB` | 19 |
| 526 | `vmAdsRot` | 4 |
| 531 | `vmFovForAspect` | 24 |
| 555 | `VM_OFF` | 22 |
| 577 | `vmOffY` | 35 |
| 612 | `VMP` | 6 |
| 618 | `BOT_SKILLS` | 11 |
| 630 | `diffKey` | 4 |
| 635 | `rollBotSkill` | 7 |
| 642 | `botTier` | 4 |
| 646 | `_cyclePool` | 5 |
| 651 | `_rosterPool` | 22 |
| 675 | `_pinnedDefs` | 5 |
| 680 | `pickMatchRoster` | 21 |
| 701 | `BOT_WEAPON_POOL` | 5 |
| 706 | `pickMatchWeapons` | 9 |
| 718 | `constructor()` | 637 |
| 1355 | `_dom()` | 46 |
| 1401 | `_buildEnv()` | 54 |
| 1455 | `_buildViewModels()` | 269 |
| 1724 | `_vmFrame` | 141 |
| 1865 | `_vmMontarTardio` | 14 |
| 1879 | `_makePuffTexture()` | 10 |
| 1889 | `_makeBloodTex()` | 19 |
| 1908 | `_makeBloodPoolTex()` | 21 |
| 1929 | `_bloodDecal()` | 16 |
| 1945 | `_makeBloodFx()` | 20 |
| 1965 | `_bloodSpatter()` | 18 |
| 1983 | `_bloodPoolAt()` | 6 |
| 1989 | `_updateBlood()` | 14 |
| 2003 | `_makeFlashTex()` | 21 |
| 2024 | `_makeFlashSoftTex()` | 8 |
| 2032 | `_makeFlashCoreTex()` | 10 |
| 2042 | `_input()` | 6 |
| 2048 | `_kd` | 49 |
| 2097 | `_ku` | 5 |
| 2102 | `_md` | 40 |
| 2142 | `_mu` | 7 |
| 2149 | `_mm` | 20 |
| 2169 | `_wh` | 17 |
| 2186 | `_cc` | 1 |
| 2187 | `_blur` | 1 |
| 2188 | `_plc` | 19 |
| 2207 | `_touchControls()` | 135 |
| 2342 | `_aimAssist()` | 28 |
| 2370 | `_requestLock()` | 27 |
| 2397 | `_travaAtalhos()` | 4 |
| 2401 | `_soltaAtalhos()` | 5 |
| 2406 | `espectando()` | 2 |
| 2408 | `_acceptInput()` | 7 |
| 2415 | `travarEntrada()` | 17 |
| 2432 | `_chatSeguraPausa()` | 5 |
| 2437 | `_pauseBackdrop()` | 7 |
| 2444 | `_radioShow()` | 6 |
| 2450 | `_radioUi()` | 8 |
| 2458 | `_radioPick()` | 20 |
| 2478 | `_abilityNotice()` | 10 |
| 2488 | `_resetSliceAbilities()` | 9 |
| 2497 | `_stackTrace()` | 28 |
| 2525 | `_updateMotocaCharge()` | 10 |
| 2535 | `_recordRoutePoint()` | 11 |
| 2546 | `_routePing()` | 23 |
| 2569 | `_tickRoutePings()` | 12 |
| 2581 | `_objectiveInteractionMultiplier()` | 14 |
| 2595 | `start()` | 5 |
| 2600 | `_startAnnouncerLab()` | 9 |
| 2609 | `_startRound()` | 38 |
| 2647 | `_resetPositions()` | 255 |
| 2902 | `_checkCtfAlvo()` | 13 |
| 2915 | `_checkPace()` | 13 |
| 2928 | `_endRound()` | 34 |
| 2962 | `_roundWinnerVoice()` | 12 |
| 2974 | `_fimDaPartida()` | 7 |
| 2981 | `_endMatch()` | 61 |
| 3042 | `_ensureDolly()` | 41 |
| 3083 | `_tickDolly()` | 23 |
| 3106 | `setPaused()` | 23 |
| 3129 | `_now()` | 3 |
| 3132 | `pauseArmed()` | 1 |
| 3133 | `_syncPauseArm()` | 7 |
| 3140 | `resume()` | 4 |
| 3144 | `applySettings()` | 10 |
| 3154 | `_applyQuality()` | 13 |
| 3167 | `onResize()` | 17 |
| 3184 | `_switchTeam()` | 66 |
| 3250 | `_applyVmVisibility()` | 34 |
| 3284 | `_ensureVmPrecisionQa()` | 79 |
| 3363 | `_syncVmPresentation()` | 19 |
| 3382 | `_vmlabEnsure()` | 14 |
| 3396 | `_vmlabFrame()` | 28 |
| 3424 | `_tuneGet()` | 15 |
| 3439 | `_tune()` | 23 |
| 3462 | `_fxSet()` | 2 |
| 3464 | `_qaCicloArma()` | 8 |
| 3472 | `_cycleWeapon()` | 8 |
| 3480 | `_switchWeapon()` | 39 |
| 3519 | `_deploySfx()` | 7 |
| 3526 | `_scope()` | 17 |
| 3543 | `_zoomFov()` | 5 |
| 3548 | `_reloading()` | 1 |
| 3549 | `_startReload()` | 25 |
| 3574 | `_reloadLayers()` | 18 |
| 3592 | `_installRecoil()` | 33 |
| 3625 | `_shotRecoil()` | 13 |
| 3638 | `_tryShoot()` | 81 |
| 3719 | `_tryKnifeAttack()` | 14 |
| 3733 | `_meleeHit()` | 16 |
| 3749 | `_meleeRange()` | 5 |
| 3754 | `_botMelee()` | 28 |
| 3782 | `_shotDamage()` | 11 |
| 3793 | `_fireHitscan()` | 70 |
| 3863 | `_targetFromHit()` | 9 |
| 3872 | `_penetrationExit()` | 20 |
| 3892 | `_surfaceOf()` | 27 |
| 3919 | `_armoredTarget()` | 3 |
| 3922 | `_fleshImpact()` | 38 |
| 3960 | `_fxVoice()` | 9 |
| 3969 | `_impactSfx()` | 17 |
| 3986 | `_tintFx()` | 16 |
| 4002 | `_damage()` | 42 |
| 4044 | `_playerHurtFx()` | 6 |
| 4050 | `_kill()` | 53 |
| 4103 | `_checkArenaWin()` | 30 |
| 4133 | `_dmgArc()` | 79 |
| 4212 | `_mkBanner()` | 9 |
| 4221 | `_updateKillSequenceHud()` | 12 |
| 4233 | `_resetKillSequence()` | 5 |
| 4238 | `_playerKillFeedback()` | 18 |
| 4256 | `_acertoPrevisto()` | 5 |
| 4261 | `_hitmarker()` | 15 |
| 4276 | `_dmgNumber()` | 20 |
| 4296 | `_feed()` | 19 |
| 4315 | `_skullIcon()` | 6 |
| 4321 | `_killfeedWeaponIcon()` | 9 |
| 4330 | `_wpnIcon()` | 64 |
| 4394 | `_tracer()` | 26 |
| 4420 | `_puff()` | 39 |
| 4459 | `_holeDecalMat()` | 8 |
| 4467 | `_flash()` | 61 |
| 4528 | `_vmTetoTela()` | 10 |
| 4538 | `_muzzleWorld()` | 30 |
| 4568 | `_aimOrigin()` | 5 |
| 4573 | `_updateDoors()` | 10 |
| 4583 | `_updateFx()` | 57 |
| 4640 | `_ejectCasing()` | 17 |
| 4657 | `_makeCtfFlagTex()` | 23 |
| 4680 | `_paintFlagSymbol()` | 9 |
| 4689 | `_flagTexFor()` | 26 |
| 4715 | `_legadoSimbolo()` | 8 |
| 4723 | `_loadCtfSymbols()` | 22 |
| 4745 | `_makeCtfZoneTex()` | 31 |
| 4776 | `_makeSmokeTex()` | 10 |
| 4786 | `_updateSmokeHud()` | 4 |
| 4790 | `_grenadeSpatial()` | 14 |
| 4804 | `_spawnGrenade()` | 19 |
| 4823 | `_throwNade()` | 13 |
| 4836 | `_throwSmoke()` | 1 |
| 4837 | `_throwFrag()` | 4 |
| 4841 | `_explodeFrag()` | 40 |
| 4881 | `_corDaFumaca()` | 16 |
| 4897 | `_popSmoke()` | 23 |
| 4920 | `_updateGrenades()` | 35 |
| 4955 | `_teamColor()` | 15 |
| 4970 | `_teamInk()` | 7 |
| 4977 | `_factionOf()` | 1 |
| 4978 | `_voiceKey()` | 1 |
| 4979 | `_teamName()` | 1 |
| 4980 | `_teamTag()` | 6 |
| 4986 | `_plaqueta()` | 13 |
| 4999 | `_mirror()` | 2 |
| 5001 | `_defNoLado()` | 3 |
| 5004 | `_botSeparation()` | 61 |
| 5065 | `_initCTF()` | 86 |
| 5151 | `_updateCTF()` | 61 |
| 5212 | `_ctfWin()` | 24 |
| 5236 | `_freeYaw()` | 25 |
| 5261 | `_pullString()` | 23 |
| 5284 | `_walkReach()` | 32 |
| 5316 | `_wpComp()` | 16 |
| 5332 | `_findPathLocal()` | 22 |
| 5354 | `_botCtf()` | 137 |
| 5491 | `_hideCtfHud()` | 6 |
| 5497 | `_updateCtfHud()` | 76 |
| 5573 | `_collide()` | 23 |
| 5596 | `_collideRot()` | 22 |
| 5618 | `_mantleAlcance()` | 50 |
| 5668 | `_mantleAlcancavel()` | 12 |
| 5680 | `_mantleTarget()` | 35 |
| 5715 | `_freeSpot()` | 30 |
| 5745 | `_retaAndavel()` | 20 |
| 5765 | `_walkDepth()` | 16 |
| 5781 | `_noteHit()` | 17 |
| 5798 | `_deathFeedback()` | 45 |
| 5843 | `_toggleCamView()` | 6 |
| 5849 | `setCamView()` | 16 |
| 5865 | `_syncCamViewVis()` | 8 |
| 5873 | `_ensurePlayerTP()` | 26 |
| 5899 | `_updatePlayerTP()` | 42 |
| 5941 | `_updateCrosshairParallax()` | 47 |
| 5988 | `_tpDeath()` | 18 |
| 6006 | `_tpRevive()` | 13 |
| 6019 | `_moveEntity()` | 101 |
| 6120 | `_updatePlayer()` | 304 |
| 6424 | `_footstepSurface()` | 13 |
| 6437 | `_updatePickups()` | 158 |
| 6595 | `_wpnMode()` | 5 |
| 6600 | `_botWeapon()` | 10 |
| 6610 | `_municaoInfinita()` | 1 |
| 6611 | `_pickupAllowed()` | 9 |
| 6620 | `_grabNearPickup()` | 10 |
| 6630 | `_grabPickup()` | 35 |
| 6665 | `_assentarNoChao()` | 10 |
| 6675 | `refreshPickupModels()` | 24 |
| 6699 | `_dropWeapon()` | 20 |
| 6719 | `_sumirDrop()` | 36 |
| 6755 | `_spawnY()` | 3 |
| 6758 | `_spawnYaw()` | 5 |
| 6763 | `_pickSpawn()` | 23 |
| 6786 | `_respawnPlayer()` | 34 |
| 6820 | `_losClear()` | 18 |
| 6838 | `_botCall()` | 41 |
| 6879 | `_teamMarkTex()` | 23 |
| 6902 | `_makeTeamMark()` | 16 |
| 6918 | `_trocarPersonagem()` | 18 |
| 6936 | `_syncRemoteWeapon()` | 23 |
| 6959 | `_updateTeamMark()` | 7 |
| 6966 | `_botEye()` | 1 |
| 6967 | `_enemyOf()` | 8 |
| 6975 | `_duelToken()` | 22 |
| 6997 | `_respawnEntity()` | 21 |
| 7018 | `_updateBot()` | 838 |
| 7856 | `_flushTraining()` | 13 |
| 7869 | `_updateBotNN()` | 73 |
| 7942 | `_botShootNN()` | 46 |
| 7988 | `_radarFoot()` | 38 |
| 8026 | `_updateRadar()` | 64 |
| 8090 | `_banner()` | 26 |
| 8116 | `_resultadoDaRodada()` | 4 |
| 8120 | `_showScoreboard()` | 49 |
| 8169 | `_updateWeaponHud()` | 35 |
| 8204 | `_updateHud()` | 88 |
| 8292 | `update()` | 90 |
| 8382 | `dispose()` | 51 |

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
