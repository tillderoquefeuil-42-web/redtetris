import styled from 'styled-components';
import { devices } from '../../devices/devices.js';

export const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
`;

export const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    min-width: 120px;

    @media ${devices.mobileS}, @media ${devices.mobileM}, @media ${devices.mobileL} {
        min-width: 220px;
    }

    @media ${devices.tablet}, @media ${devices.laptop}, @media ${devices.laptopL} {
        min-width: 270px;
    }
    
    @media ${devices.desktop}, @media ${devices.desktopL} {
        min-width: 620px;
    }
`;


export const BoardWrapper = styled.div`
    width: 100px;
    height: 200px;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    background: #6f1c1c;
    border: 10px solid #1f0000;
    border-radius: 10px;
    box-shadow: inset 0px 0px 50px -10px rgba(0,0,0,0.74);

    @media ${devices.mobileS}, @media ${devices.mobileM}, @media ${devices.mobileL} {
        width: 200px;
        height: 400px;
    }

    @media ${devices.tablet}, @media ${devices.laptop}, @media ${devices.laptopL} {
        width: 250px;
        height: 500px;
    }

    @media ${devices.desktop}, @media ${devices.desktopL} {
        width: 600px;
        height: 1200px;
    }
`;

export const NextPieceWrapper = styled.div`

    width: 100px;
    height: 40px;
    display: flex;
    flex-wrap: wrap;

    @media ${devices.mobileS}, @media ${devices.mobileM}, @media ${devices.mobileL} {
        width: 200px;
        height: 80px;
    }

    @media ${devices.tablet}, @media ${devices.laptop}, @media ${devices.laptopL} {
        width: 250px;
        height: 100px;
    }

    @media ${devices.desktop}, @media ${devices.desktopL} {
        width: 600px;
        height: 240px;
    }
`;


export const PreviewWrapper = styled(BoardWrapper)`
    width: 50px;
    height: 100px;
    background: none;
    border: 3px solid #7b1313;
    border-radius: 5px;
    box-shadow: none;

    @media ${devices.mobileS}, @media ${devices.mobileM}, @media ${devices.mobileL} {
        width: 100px;
        height: 200px;
    }

    @media ${devices.tablet}, @media ${devices.laptop}, @media ${devices.laptopL} {
        width: 150px;
        height: 300px;
    }

    @media ${devices.desktop}, @media ${devices.desktopL} {
        width: 300px;
        height: 600px;
    }
`;


export const Block = styled.div`
    width: 9.8px;
    height: 9.8px;
    border: 0.1px solid ${props => props.demo? (props.plain? '#000' : 'transparent') : '#420101'};
    background: ${props => props.plain? props.color : 'none'};
    
    @media ${devices.mobileS}, @media ${devices.mobileM}, @media ${devices.mobileL} {
        border: 0.5px solid ${props => props.demo? (props.plain? '#000' : 'transparent') : '#420101'};
        width: 19px;
        height: 19px;
    }

    @media ${devices.tablet}, @media ${devices.laptop}, @media ${devices.laptopL} {
        width: 24px;
        height: 24px;
    }

    @media ${devices.desktop}, @media ${devices.desktopL} {
        width: 59px;
        height: 59px;
    }
`;

export const PreviewBlock = styled.div`
    width: 4.8px;
    height: 4.8px;
    border: 0.1px solid ${props => props.plain? '#7b1313' : 'transparent'};
    background: ${props => props.plain? '#7b1313' : 'none'};

    @media ${devices.mobileS}, @media ${devices.mobileM}, @media ${devices.mobileL} {
        border: 0.5px solid ${props => props.plain? '#7b1313' : 'transparent'};
        width: 9px;
        height: 9px;
    }

    @media ${devices.tablet}, @media ${devices.laptop}, @media ${devices.laptopL} {
        width: 14px;
        height: 14px;
    }

    @media ${devices.desktop}, @media ${devices.desktopL} {
        width: 29px;
        height: 29px;
    }
`;

export const Score = styled.h1`
    color: #fff;
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
`;

export const PreviewScore = styled(Score)`
    font-size: 20px;
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
`;
