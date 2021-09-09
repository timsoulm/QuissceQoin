function getDadScoreDescription(dadScore) {
    if (dadScore < 50) {
        return 'This dad score is so bad that its good!';
    } else if (dadScore >= 50 && dadScore < 150) {
        return 'This dad score is horrendous';
    } else if (dadScore >= 150 && dadScore < 300) {
        return 'This dad score is pretty bad';
    } else if (dadScore >= 300 && dadScore < 450) {
        return 'This dad score is not great';
    } else if (dadScore >= 450 && dadScore < 600) {
        return 'This dad score is good';
    } else if (dadScore >= 600 && dadScore < 750) {
        return 'This dad score is really quite good';
    } else if (dadScore >= 750 && dadScore < 900) {
        return 'This dad score is incredible';
    } else if (dadScore >= 900 && dadScore < 950) {
        return 'This dad score is mind boggling';
    } else if (dadScore >= 950 && dadScore < 990) {
        return 'This dad score is making my head spin its so ridiculously high';
    } else if (dadScore >= 990) {
        return 'Dad scores do not get much higher than this. This is an ultimate father.';
    }
    return 'This dad score is unknown.'
}

export default getDadScoreDescription;