import styled from 'styled-components';

export const Wrapper = styled.div`
    width: ${props => props.width ? props.width : "100"}px;
    height: ${props => props.width ? 2*props.width : "200"}px;
    border: 1px solid #000;
    position: relative;
    display: flex;
    flex-wrap: wrap;
`;

export const Block = styled.div`
    width: ${props => props.size ? props.size-1 : "9"}px;
    height: ${props => props.size ? props.size-1 : "9"}px;
    border: 0.5px solid #000;

    background: ${props => props.plain? props.color : "none"};
        
`;