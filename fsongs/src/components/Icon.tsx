import React, {ReactElement} from 'react';
import {TouchableOpacity} from 'react-native'

type IconProps = { onPress: () => void, children: ReactElement, disabled?: boolean, style?: {} }

const Icon: React.FC<IconProps> = ({onPress, children, disabled = false, style}: IconProps): ReactElement => {
    return (
        <TouchableOpacity disabled={disabled} style={{justifyContent: 'center', paddingHorizontal: 15, ...style}}
                          onPress={() => onPress()}>
            {children}
        </TouchableOpacity>
    );
};

export default Icon;
