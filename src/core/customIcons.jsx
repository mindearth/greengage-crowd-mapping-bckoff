import Icon from '@ant-design/icons';


const NavStartSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
        <path
            d="M 2 2 C 0.896 2 0 2.896 0 4 L 0 22 C 0 23.104 0.896 24 2 24 L 24 24 C 25.104 24 26 23.104 26 22 L 26 4 C 26 2.896 25.104 2 24 2 L 2 2 z M 2 4 L 24 4 L 24 22 L 2 22 L 2 4 z M 10.71875 8.46875 C 10.592875 8.474 10.45475 8.52675 10.34375 8.59375 C 10.12375 8.72675 10 8.96375 10 9.21875 L 10 16.78125 C 10 17.03525 10.12375 17.27325 10.34375 17.40625 C 10.46575 17.47825 10.612 17.53125 10.75 17.53125 C 10.865 17.53125 10.98775 17.4905 11.09375 17.4375 L 17.59375 13.65625 C 17.84575 13.53125 18 13.278 18 13 C 18 12.722 17.84675 12.46875 17.59375 12.34375 L 11.09375 8.5625 C 10.97825 8.5045 10.844625 8.4635 10.71875 8.46875 z"/>
    </svg>
)

const NavTurnRightSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path
            d="M 10.736328 1.0292969 L 10.013672 1.7207031 L 12.201172 4 L 4.5 4 C 3.6774686 4 3 4.6774686 3 5.5 L 3 13 L 4 13 L 4 5.5 C 4 5.2185314 4.2185314 5 4.5 5 L 12.201172 5 L 10.013672 7.2792969 L 10.736328 7.9707031 L 14.068359 4.5 L 10.736328 1.0292969 z"
            overflow="visible"/>
    </svg>
)

const NavTurnLeftSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path
            d="M 5.2636719 1.0292969 L 1.9316406 4.5 L 5.2636719 7.9707031 L 5.9863281 7.2792969 L 3.7988281 5 L 11.5 5 C 11.781469 5 12 5.2185314 12 5.5 L 12 13 L 13 13 L 13 5.5 C 13 4.6774686 12.322531 4 11.5 4 L 3.7988281 4 L 5.9863281 1.7207031 L 5.2636719 1.0292969 z"
            overflow="visible"/>
    </svg>
)

const NavStraightSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path
            d="M 7.5 0.93164062 L 4.0292969 4.2636719 L 4.7207031 4.9863281 L 7.0097656 2.7890625 L 7.0097656 14 L 8.0097656 14 L 8.0097656 2.8085938 L 10.279297 4.9863281 L 10.970703 4.2636719 L 7.5 0.93164062 z"
            overflow="visible"/>
    </svg>
)

const NavFinishSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path
            d="M 1 2 L 1 2.5 L 1 8 L 1 10 L 1 14 L 2 14 L 2 10 L 15 10 L 15 2 L 1 2 z M 4 3 L 6 3 L 6 5 L 8 5 L 8 3 L 10 3 L 10 5 L 12 5 L 12 3 L 14 3 L 14 5 L 12 5 L 12 7 L 14 7 L 14 9 L 12 9 L 12 7 L 10 7 L 10 9 L 8 9 L 8 7 L 6 7 L 6 9 L 4 9 L 4 7 L 2 7 L 2 5 L 4 5 L 4 3 z M 4 5 L 4 7 L 6 7 L 6 5 L 4 5 z M 8 7 L 10 7 L 10 5 L 8 5 L 8 7 z"/>
    </svg>

)


export const NavStartIcon = (props) => <Icon component={NavStartSvg} {...props} />
export const NavTurnRightIcon = (props) => <Icon component={NavTurnRightSvg} {...props} />
export const NavTurnLeftIcon = (props) => <Icon component={NavTurnLeftSvg} {...props} />
export const NavStraightIcon = (props) => <Icon component={NavStraightSvg} {...props} />
export const NavFinishIcon = (props) => <Icon component={NavFinishSvg} {...props} />

