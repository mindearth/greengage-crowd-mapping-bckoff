import Icon from '@ant-design/icons';


const NavStartSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
            d="M 12 2 C 6.4889972 2 2 6.4889972 2 12 C 2 17.511003 6.4889972 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889972 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 12 10 C 10.895431 10 10 10.895431 10 12 C 10 13.104569 10.895431 14 12 14 C 13.104569 14 14 13.104569 14 12 C 14 10.895431 13.104569 10 12 10 z"
            overflow="visible"/>
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
            d="M 12 2 C 6.48 2 2 6.48 2 12 C 2 17.52 6.48 22 12 22 C 17.52 22 22 17.52 22 12 C 22 6.48 17.52 2 12 2 z M 12 4 C 16.41 4 20 7.59 20 12 C 20 16.41 16.41 20 12 20 C 7.59 20 4 16.41 4 12 C 4 7.59 7.59 4 12 4 z M 12 6 C 8.69 6 6 8.69 6 12 C 6 15.31 8.69 18 12 18 C 15.31 18 18 15.31 18 12 C 18 8.69 15.31 6 12 6 z"/>
    </svg>
)


export const NavStartIcon = (props) => <Icon component={NavStartSvg} {...props} />
export const NavTurnRightIcon = (props) => <Icon component={NavTurnRightSvg} {...props} />
export const NavTurnLeftIcon = (props) => <Icon component={NavTurnLeftSvg} {...props} />
export const NavStraightIcon = (props) => <Icon component={NavStraightSvg} {...props} />
export const NavFinishIcon = (props) => <Icon component={NavFinishSvg} {...props} />

