import {ImageSourcePropType} from "react-native";
import {colors} from "./colors";

export type SkeletonBird = {
    image: ImageSourcePropType,
    name: string,
    color: string,
    capability: string,
    description: string
}

export const skeletons: SkeletonBird[] = [

    {
        image: require('../../assets/icons/kiwi.png'),
        name: 'Kiwi',
        color: 'rgba(255,255,255,0.7)',
        capability: 'BEIM AUSSPIELEN: Wirf eine deiner Bonuskarten ab. Ziehe dann 4 neue Bonuskarten und behalte 2 davon.',
        description: 'Die weiblichen Tiere sind größer als die männlichen. Kiwis leben in Paaren und paaren sich ein Leben lang.'
    },
    {
        image: require('../../assets/icons/blaumeise_klein.png'),
        name: 'Blaumeise',
        color: colors.brown,
        capability: 'BEI AKTIVIERUNG: Schiebe 1 Karte aus deiner Hand unter diese Karte.',
        description: 'Blaumeisen brüten meist in Baumhöhlen, auch Nistkästen werden häufig angenommen.'
    },
    {
        image: require('../../assets/icons/kiebitz.png'),
        name: 'Kiebitz',
        color: '#EA899A',
        capability: '1x ZWISCHEN DEINEN ZÜGEN: Spielt ein Mitspieler einen Vogel, dann erhalte 1 Wurm aus dem Vorrat',
        description: 'Kiebitze sind während der Brutzeit sehr stimmfreudig; ihr Rufen klingt klagend schrill, wie „kschäää“ oder „kiju-wit“.'
    },
    {
        image: require('../../assets/icons/schneeeule.png'),
        name: 'Schneeeule',
        color: '#23ccdb',
        capability: 'AM ENDENENDE: Dieser Vogel zählt für das Rundenziel doppelt (sofern er die Bedingungen des Ziels erfüllt).',
        description: 'Der kurze arktische Sommer lässt den gerade selbständig gewordenen Jungvögeln nur wenig Zeit, notwendige Jagderfahrung zu sammeln.'
    }
    ,
    {
        image: require('../../assets/icons/rotkehlchen.png'),
        name: 'Rotkehlchen',
        color: '#dbaa23',
        capability: 'AM SPIELENDE: Lege 1 Ei auf jeder deiner Vögel mit dem X-Nest',
        description: 'Das Rotkehlchen ist vermutlich Deutschlands beliebtester Singvogel obwohl die Kohlmeise viel netter ist.'
    }
]
