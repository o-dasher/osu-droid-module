import { ModDoubleTime, Parser } from "@rian8337/osu-base";
import { MapStars } from "../src/MapStars";
import { readFile } from "fs/promises";
import { join } from "path";

const testDiffCalc = async (
    name: string,
    values: Readonly<{
        noModDroidRating: Readonly<{
            aim: number;
            tap: number;
            rhythm: number;
            flashlight: number;
            total: number;
        }>;
        noModPcRating: Readonly<{
            aim: number;
            speed: number;
            flashlight: number;
            total: number;
        }>;
        clockRateDroidRating: Readonly<{
            aim: number;
            tap: number;
            rhythm: number;
            flashlight: number;
            total: number;
        }>;
        clockRatePcRating: Readonly<{
            aim: number;
            speed: number;
            flashlight: number;
            total: number;
        }>;
    }>
) => {
    const data = await readFile(
        join(process.cwd(), "tests", "files", "beatmaps", `${name}.osu`),
        { encoding: "utf-8" }
    );

    const parser = new Parser().parse(data);

    const rating = new MapStars().calculate({
        map: parser.map,
    });

    expect(rating.droidStars.aim).toBeCloseTo(values.noModDroidRating.aim, 3);
    expect(rating.droidStars.tap).toBeCloseTo(values.noModDroidRating.tap, 3);
    expect(rating.droidStars.rhythm).toBeCloseTo(
        values.noModDroidRating.rhythm
    );
    expect(rating.droidStars.flashlight).toBeCloseTo(
        values.noModDroidRating.flashlight,
        3
    );
    expect(rating.droidStars.total).toBeCloseTo(
        values.noModDroidRating.total,
        4
    );

    expect(rating.pcStars.aim).toBeCloseTo(values.noModPcRating.aim, 3);
    expect(rating.pcStars.speed).toBeCloseTo(values.noModPcRating.speed, 3);
    expect(rating.pcStars.flashlight).toBeCloseTo(
        values.noModPcRating.flashlight,
        3
    );
    expect(rating.pcStars.total).toBeCloseTo(values.noModPcRating.total, 4);

    const clockRateAdjustedRating = new MapStars().calculate({
        map: parser.map,
        mods: [new ModDoubleTime()],
    });

    expect(clockRateAdjustedRating.droidStars.aim).toBeCloseTo(
        values.clockRateDroidRating.aim,
        3
    );
    expect(clockRateAdjustedRating.droidStars.tap).toBeCloseTo(
        values.clockRateDroidRating.tap,
        3
    );
    expect(clockRateAdjustedRating.droidStars.rhythm).toBeCloseTo(
        values.clockRateDroidRating.rhythm,
        3
    );
    expect(clockRateAdjustedRating.droidStars.flashlight).toBeCloseTo(
        values.clockRateDroidRating.flashlight,
        3
    );
    expect(clockRateAdjustedRating.droidStars.total).toBeCloseTo(
        values.clockRateDroidRating.total,
        4
    );

    expect(clockRateAdjustedRating.pcStars.aim).toBeCloseTo(
        values.clockRatePcRating.aim,
        3
    );
    expect(clockRateAdjustedRating.pcStars.speed).toBeCloseTo(
        values.clockRatePcRating.speed,
        3
    );
    expect(clockRateAdjustedRating.pcStars.flashlight).toBeCloseTo(
        values.clockRatePcRating.flashlight,
        3
    );
    expect(clockRateAdjustedRating.pcStars.total).toBeCloseTo(
        values.clockRatePcRating.total,
        4
    );
};

test("Test difficulty calculation sample beatmap 1", async () => {
    await testDiffCalc(
        "YOASOBI - Love Letter (ohm002) [Please accept my overflowing emotions.]",
        {
            noModDroidRating: {
                aim: 2.02939979795515,
                tap: 1.5506258971277869,
                rhythm: 1.5520675775122406,
                flashlight: 0.2775619593657913,
                total: 3.794839733139548,
            },
            noModPcRating: {
                aim: 2.380333686066187,
                speed: 1.9081966791619958,
                flashlight: 1.469925865780847,
                total: 4.516294389592336,
            },
            clockRateDroidRating: {
                aim: 2.825276908106492,
                tap: 2.1753943586432842,
                rhythm: 1.8502886868333224,
                flashlight: 0.4473137599495242,
                total: 5.294022080364695,
            },
            clockRatePcRating: {
                aim: 3.26222073103768,
                speed: 2.7347306645944975,
                flashlight: 2.1848608772021496,
                total: 6.283680696383357,
            },
        }
    );
});

test("Test difficulty calculation sample beatmap 2", async () => {
    await testDiffCalc("Kenji Ninuma - DISCOPRINCE (peppy) [Normal]", {
        noModDroidRating: {
            aim: 0.9798373149240929,
            tap: 1.0241290720215277,
            rhythm: 0.9461494845183716,
            flashlight: 0.10989785205252953,
            total: 2.082351577002906,
        },
        noModPcRating: {
            aim: 1.2853681936311694,
            speed: 1.1776242355913606,
            flashlight: 0.44268742767870073,
            total: 2.563685990010083,
        },
        clockRateDroidRating: {
            aim: 1.3195263091903684,
            tap: 1.457898058221944,
            rhythm: 1.243911483081148,
            flashlight: 0.17621165290704682,
            total: 2.8928884665601844,
        },
        clockRatePcRating: {
            aim: 1.7277106868093492,
            speed: 1.683686005899145,
            flashlight: 0.6421943981100025,
            total: 3.5434319862501202,
        },
    });
});

test("Test difficulty calculation sample beatmap 3", async () => {
    await testDiffCalc(
        "sphere - HIGH POWERED (TV Size) (Azunyan-) [POWER OVERLOAD EXPERT]",
        {
            noModDroidRating: {
                aim: 2.3953211346822942,
                tap: 3.400473096192214,
                rhythm: 2.2995674009455094,
                flashlight: 0.4907826803311003,
                total: 6.223047678094107,
            },
            noModPcRating: {
                aim: 2.9844158923979682,
                speed: 3.0232169527379598,
                flashlight: 2.116873738481202,
                total: 6.239224371561388,
            },
            clockRateDroidRating: {
                aim: 3.487517365342624,
                tap: 5.059977101162711,
                rhythm: 2.4795796076511385,
                flashlight: 0.7802411562208821,
                total: 9.211863294064479,
            },
            clockRatePcRating: {
                aim: 4.203173691714608,
                speed: 4.5509547769922465,
                flashlight: 3.100406564705179,
                total: 9.10782416909572,
            },
        }
    );
});

test("Test difficulty calculation sample beatmap 4", async () => {
    await testDiffCalc("Ocelot - KAEDE (Hollow Wings) [EX EX]", {
        noModDroidRating: {
            aim: 2.4787385216640407,
            tap: 1.4376913945438932,
            rhythm: 1.407324194647642,
            flashlight: 0.3233319353495281,
            total: 4.378711505519505,
        },
        noModPcRating: {
            aim: 4.537924998518297,
            speed: 1.87761310526086,
            flashlight: 1.7350966585210856,
            total: 7.77631129957478,
        },
        clockRateDroidRating: {
            aim: 3.4686482652957387,
            tap: 2.049324193281434,
            rhythm: 1.6795128268785318,
            flashlight: 0.5233010519068477,
            total: 6.140578014529187,
        },
        clockRatePcRating: {
            aim: 6.010075838404166,
            speed: 2.704738611644462,
            flashlight: 2.554535665503798,
            total: 10.344466173510687,
        },
    });
});
