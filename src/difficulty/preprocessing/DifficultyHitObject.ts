import { HitObject } from "../../beatmap/hitobjects/HitObject";

/**
 * Represents an osu!standard hit object with difficulty calculation values.
 */
export class DifficultyHitObject {
    /**
     * The underlying hitobject.
     */
    readonly object: HitObject;

    /**
     * The aim strain generated by the hitobject.
     */
    aimStrain: number = 0;

    /**
     * The tap strain generated by the hitobject.
     */
    tapStrain: number = 0;

    /**
     * The tap strain generated by the hitobject if `strainTime` isn't modified by
     * OD. This is used in three-finger detection.
     */
    originalTapStrain: number = 0;

    /**
     * The rhythm multiplier generated by the hitobject.
     */
    rhythmMultiplier: number = 0;

    /**
     * The flashlight strain generated by the hitobject.
     */
    flashlightStrain: number = 0;

    /**
     * The normalized distance from the "lazy" end position of the previous hitobject to the start position of this hitobject.
     *
     * The "lazy" end position is the position at which the cursor ends up if the previous hitobject is followed with as minimal movement as possible (i.e. on the edge of slider follow circles).
     */
    lazyJumpDistance: number = 0;

    /**
     * The normalized shortest distance to consider for a jump between the previous hitobject and this hitobject.
     *
     * This is bounded from above by `lazyJumpDistance`, and is smaller than the former if a more natural path is able to be taken through the previous hitobject.
     *
     * Suppose a linear slider - circle pattern. Following the slider lazily (see: `lazyJumpDistance`) will result in underestimating the true end position of the slider as being closer towards the start position.
     * As a result, `lazyJumpDistance` overestimates the jump distance because the player is able to take a more natural path by following through the slider to its end,
     * such that the jump is felt as only starting from the slider's true end position.
     *
     * Now consider a slider - circle pattern where the circle is stacked along the path inside the slider.
     * In this case, the lazy end position correctly estimates the true end position of the slider and provides the more natural movement path.
     */
    minimumJumpDistance: number = 0;

    /**
     * The time taken to travel through `minimumJumpDistance`, with a minimum value of 25ms.
     */
    minimumJumpTime: number = 0;

    /**
     * The normalized distance between the start and end position of this hitobject.
     */
    travelDistance: number = 0;

    /**
     * The time taken to travel through `travelDistance`, with a minimum value of 25ms for a non-zero distance.
     */
    travelTime: number = 0;

    /**
     * Angle the player has to take to hit this hitobject.
     *
     * Calculated as the angle between the circles (current-2, current-1, current).
     */
    angle: number | null = null;

    /**
     * The amount of milliseconds elapsed between this hitobject and the last hitobject.
     */
    deltaTime: number = 0;

    /**
     * The amount of milliseconds elapsed since the start time of the previous hitobject, with a minimum of 25ms.
     */
    strainTime: number = 0;

    /**
     * Adjusted start time of the hitobject, taking speed multiplier into account.
     */
    startTime: number = 0;

    /**
     * The radius of the hitobject.
     */
    radius: number = 0;

    /**
     * @param object The underlying hitobject.
     */
    constructor(object: HitObject) {
        this.object = object;
    }
}
