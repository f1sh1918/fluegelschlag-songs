import React, {ReactElement} from 'react';
import {TouchableOpacity} from 'react-native'

type IconProps = { onPress: () => void, children: ReactElement, disabled?: boolean }

const Icon: React.FC<IconProps> = ({onPress, children, disabled=false}: IconProps): ReactElement => {
    return (
        <TouchableOpacity disabled={disabled} style={{justifyContent:'center',paddingHorizontal:15}}onPress={() => onPress()}>
            {children}
        </TouchableOpacity>
    );
};

export default Icon;
