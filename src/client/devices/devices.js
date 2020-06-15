const size = {
    mobileS : {
        width   : '320px',
        height  : '480px'
    },
    mobileM : {
		width	: '375px',
		height	: '667px'
	},
    mobileL : {
		width	: '425px',
		height	: '750px'
	},
    tablet  : {
		width	: '768px',
		height	: '1024px'
	},
    laptop  : {
		width	: '1024px',
		height	: '768px'
	},
    laptopL : {
		width	: '1440px',
		height	: '900px'
	},
    desktop : {
		width	: '2560px',
        height  : '1440px'
    }
}

export const devices = {
    mobileS : `(min-width: ${ size.mobileS.width }) and (min-height: ${ size.mobileS.height })`,
    mobileM : `(min-width: ${ size.mobileM.width }) and (min-height: ${ size.mobileM.height })`,
    mobileL : `(min-width: ${ size.mobileL.width }) and (min-height: ${ size.mobileL.height })`,
    tablet  : `(min-width: ${ size.tablet.width }) and (min-height: ${ size.tablet.height })`,
    laplet  : `(min-width: ${ size.tablet.width }) and (min-height: ${ size.laptop.height })`,
    laptop  : `(min-width: ${ size.laptop.width }) and (min-height: ${ size.laptop.height })`,
    laptopL : `(min-width: ${ size.laptopL.width }) and (min-height: ${ size.laptopL.height })`,
    desktop : `(min-width: ${ size.desktop.width }) and (min-height: ${ size.desktop.height })`,
    desktopL: `(min-width: ${ size.desktop.width }) and (min-height: ${ size.desktop.height })`
};