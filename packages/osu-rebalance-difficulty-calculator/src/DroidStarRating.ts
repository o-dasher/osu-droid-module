import {
    Beatmap,
    Mod,
    MapStats,
    modes,
    ModRelax,
    ModFlashlight,
} from "@rian8337/osu-base";
import { DroidAim } from "./skills/DroidAim";
import { DroidTap } from "./skills/DroidTap";
import { StarRating } from "./base/StarRating";
import { DroidSkill } from "./skills/DroidSkill";
import { DroidFlashlight } from "./skills/DroidFlashlight";
import { DroidRhythm } from "./skills/DroidRhythm";

/**
 * Difficulty calculator for osu!droid gamemode.
 */
export class DroidStarRating extends StarRating {
    /**
     * The aim star rating of the beatmap.
     */
    aim: number = 0;

    /**
     * The tap star rating of the beatmap.
     */
    tap: number = 0;

    /**
     * The rhythm star rating of the beatmap.
     */
    rhythm: number = 0;

    /**
     * The flashlight star rating of the beatmap.
     */
    flashlight: number = 0;

    protected override readonly difficultyMultiplier: number = 0.18;

    /**
     * Calculates the star rating of the specified beatmap.
     *
     * The beatmap is analyzed in chunks of `sectionLength` duration.
     * For each chunk the highest hitobject strains are added to
     * a list which is then collapsed into a weighted sum, much
     * like scores are weighted on a user's profile.
     *
     * For subsequent chunks, the initial max strain is calculated
     * by decaying the previous hitobject's strain until the
     * beginning of the new chunk.
     *
     * The first object doesn't generate a strain
     * so we begin calculating from the second object.
     *
     * Also don't forget to manually add the peak strain for the last
     * section which would otherwise be ignored.
     */
    override calculate(params: {
        /**
         * The beatmap to calculate.
         */
        map: Beatmap;

        /**
         * Applied modifications.
         */
        mods?: Mod[];

        /**
         * Custom map statistics to apply custom tap multiplier as well as old statistics.
         */
        stats?: MapStats;
    }): this {
        return super.calculate(params, modes.droid);
    }

    /**
     * Calculates the aim star rating of the beatmap and stores it in this instance.
     */
    calculateAim(): void {
        const aimSkill: DroidAim = new DroidAim(this.mods, true);
        const aimSkillWithoutSliders: DroidAim = new DroidAim(this.mods, false);

        this.calculateSkills(aimSkill, aimSkillWithoutSliders);

        this.strainPeaks.aimWithSliders = aimSkill.strainPeaks;
        this.strainPeaks.aimWithoutSliders = aimSkillWithoutSliders.strainPeaks;

        this.aim = this.starValue(aimSkill.difficultyValue());

        if (this.aim) {
            this.attributes.sliderFactor =
                this.starValue(aimSkillWithoutSliders.difficultyValue()) /
                this.aim;
        }
    }

    /**
     * Calculates the speed star rating of the beatmap and stores it in this instance.
     */
    calculateTap(): void {
        if (this.mods.some((m) => m instanceof ModRelax)) {
            return;
        }

        const tapSkill: DroidTap = new DroidTap(this.mods, this.stats.od!);

        this.calculateSkills(tapSkill);

        this.strainPeaks.speed = tapSkill.strainPeaks;

        this.tap = this.starValue(tapSkill.difficultyValue());

        const objectStrains: number[] = this.objects.map((v) => v.tapStrain);

        const maxStrain: number = Math.max(...objectStrains);

        if (maxStrain) {
            this.attributes.speedNoteCount = objectStrains.reduce(
                (total, next) =>
                    total + 1 / (1 + Math.exp(-((next / maxStrain) * 12 - 6))),
                0
            );
        }
    }

    /**
     * Calculates the rhythm star rating of the beatmap and stores it in this instance.
     */
    calculateRhythm(): void {
        const rhythmSkill: DroidRhythm = new DroidRhythm(
            this.mods,
            this.stats.od!
        );

        this.calculateSkills(rhythmSkill);

        this.rhythm = this.starValue(rhythmSkill.difficultyValue());
    }

    /**
     * Calculates the flashlight star rating of the beatmap and stores it in this instance.
     */
    calculateFlashlight(): void {
        const flashlightSkill: DroidFlashlight = new DroidFlashlight(this.mods);

        this.calculateSkills(flashlightSkill);

        this.strainPeaks.flashlight = flashlightSkill.strainPeaks;

        this.flashlight = this.starValue(flashlightSkill.difficultyValue());
    }

    override calculateTotal(): void {
        const aimPerformanceValue: number = this.basePerformanceValue(this.aim);
        const tapPerformanceValue: number = this.basePerformanceValue(this.tap);
        const flashlightPerformanceValue: number = this.mods.some(
            (m) => m instanceof ModFlashlight
        )
            ? Math.pow(this.flashlight, 2) * 25
            : 0;

        const basePerformanceValue: number = Math.pow(
            Math.pow(aimPerformanceValue, 1.1) +
                Math.pow(tapPerformanceValue, 1.1) +
                Math.pow(flashlightPerformanceValue, 1.1),
            1 / 1.1
        );

        if (basePerformanceValue > 1e-5) {
            this.total =
                Math.cbrt(1.12) *
                0.027 *
                (Math.cbrt(
                    (100000 / Math.pow(2, 1 / 1.1)) * basePerformanceValue
                ) +
                    4);
        }
    }

    override calculateAll(): void {
        const skills: DroidSkill[] = this.createSkills();

        const isRelax: boolean = this.mods.some((m) => m instanceof ModRelax);

        if (isRelax) {
            // Remove tap and rhythm skill to prevent overhead. These values will be 0 anyways.
            skills.splice(2, 2);
        }

        this.calculateSkills(...skills);

        const aimSkill: DroidAim = <DroidAim>skills[0];
        const aimSkillWithoutSliders: DroidAim = <DroidAim>skills[1];
        let tapSkill: DroidTap | undefined;
        let rhythmSkill: DroidRhythm | undefined;
        let flashlightSkill: DroidFlashlight;

        if (!isRelax) {
            rhythmSkill = <DroidRhythm>skills[2];
            tapSkill = <DroidTap>skills[3];
            flashlightSkill = <DroidFlashlight>skills[4];
        } else {
            flashlightSkill = <DroidFlashlight>skills[2];
        }

        this.strainPeaks.aimWithSliders = aimSkill.strainPeaks;
        this.strainPeaks.aimWithoutSliders = aimSkillWithoutSliders.strainPeaks;
        this.aim = this.starValue(aimSkill.difficultyValue());

        if (this.aim) {
            this.attributes.sliderFactor =
                this.starValue(aimSkillWithoutSliders.difficultyValue()) /
                this.aim;
        }

        if (tapSkill) {
            this.strainPeaks.speed = tapSkill.strainPeaks;

            this.tap = this.starValue(tapSkill.difficultyValue());

            const objectStrains: number[] = this.objects.map(
                (v) => v.tapStrain
            );

            const maxStrain: number = Math.max(...objectStrains);

            if (maxStrain) {
                this.attributes.speedNoteCount = objectStrains.reduce(
                    (total, next) =>
                        total +
                        1 / (1 + Math.exp(-((next / maxStrain) * 12 - 6))),
                    0
                );
            }
        }

        if (rhythmSkill) {
            this.calculateSkills(rhythmSkill);

            this.rhythm = this.starValue(rhythmSkill.difficultyValue());
        }

        this.strainPeaks.flashlight = flashlightSkill.strainPeaks;
        this.flashlight = this.starValue(flashlightSkill.difficultyValue());

        this.calculateTotal();
    }

    /**
     * Returns a string representative of the class.
     */
    override toString(): string {
        return (
            this.total.toFixed(2) +
            " stars (" +
            this.aim.toFixed(2) +
            " aim, " +
            this.tap.toFixed(2) +
            " tap, " +
            this.rhythm.toFixed(2) +
            " rhythm, " +
            this.flashlight.toFixed(2) +
            " flashlight)"
        );
    }

    /**
     * Creates skills to be calculated.
     */
    protected override createSkills(): DroidSkill[] {
        return [
            new DroidAim(this.mods, true),
            new DroidAim(this.mods, false),
            // Tap skill depends on rhythm skill, so we put it first
            new DroidRhythm(this.mods, this.stats.od!),
            new DroidTap(this.mods, this.stats.od!),
            new DroidFlashlight(this.mods),
        ];
    }
}
