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

    @media ${devices.mobileS} {
        min-width: 220px;
    }

    @media ${devices.laplet} {
        min-width: 320px;
    }
    
    @media ${devices.desktop} {
        min-width: 620px;
    }
`;


export const BoardWrapper = styled.div`
    width: 100px;
    height: 200px;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    background: #832424;
    border: 10px solid #c51b12;
    border-radius: 10px;
    box-shadow: inset 0px 0px 50px -10px rgba(0,0,0,0.74);

    @media ${devices.mobileS} {
        width: 200px;
        height: 400px;
    }

    @media ${devices.laplet} {
        width: 300px;
        height: 600px;
    }

    @media ${devices.desktop} {
        width: 600px;
        height: 1200px;
    }
`;

export const NextPieceWrapper = styled.div`

    width: 100px;
    height: 40px;
    display: flex;
    flex-wrap: wrap;

    @media ${devices.mobileS} {
        width: 200px;
        height: 80px;
    }

    @media ${devices.laplet} {
        width: 300px;
        height: 120px;
    }

    @media ${devices.desktop} {
        width: 600px;
        height: 240px;
    }
`;

export const BoardCover = styled.div`
    display: ${ props => props.gameOver? 'flex' : 'none' };
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    background: #000000c7;
`;

export const Block = styled.div`
    width: 8px;
    height: 8px;
    border: 1px solid ${props => props.demo? (props.plain? '#000' : 'transparent') : '#860000'};
    background: ${props => props.plain === 2? '#860000' : (props.plain? '#c51b12' : 'none') };

    @media ${devices.mobileS} {
        border: 1px solid ${props => props.demo? (props.plain? '#000' : 'transparent') : '#860000'};
        width: 18px;
        height: 18px;
    }

    @media ${devices.laplet} {
        width: 28px;
        height: 28px;
    }

    @media ${devices.desktop} { 
        width: 58px;
        height: 58px;
    }
`;

export const Score = styled.h1`
    color: #fff;
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
`;

export const GameOverSpan = styled(Score)`
    font-size: ${ props => props.preview? '25px' : '35px' };
    margin: 2px;
`;


export const PreviewsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
`;

export const PreviewContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    height: 320px;
`;

export const PreviewWrapper = styled(BoardWrapper)`
    width: 50px;
    height: 100px;
    background: none;
    border: 3px solid #860000;
    border-radius: 5px;
    box-shadow: none;

    @media ${devices.mobileS} {
        width: 100px;
        height: 200px;
    }

    @media ${devices.laplet} {
        width: 150px;
        height: 300px;
    }

    @media ${devices.desktop} {
        width: 300px;
        height: 600px;
    }
`;

export const PreviewBlock = styled.div`
    width: 4.8px;
    height: 4.8px;
    border: 0.1px solid ${props => props.plain? '#860000' : 'transparent'};
    background: ${props => (props.plain)? '#860000' : 'none'};

    @media ${devices.mobileS} {
        border: 0.5px solid ${props => props.plain? '#860000' : 'transparent'};
        width: 9px;
        height: 9px;
    }

    @media ${devices.laplet} {
        width: 14px;
        height: 14px;
    }

    @media ${devices.desktop} {
        width: 29px;
        height: 29px;
    }
`;

export const PreviewScore = styled(Score)`
    font-size: 20px;
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
`;

export const PreviewName = styled(Score)`
    width: 100px;
    text-align: center;
`;