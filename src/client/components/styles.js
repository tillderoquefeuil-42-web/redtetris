import styled from 'styled-components';

export const TextInput = styled.input`
    color: #ff0d00;
    background: #6d0000;

    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    border-radius: 0;
    box-shadow: none;

    height: 25px;
    padding: 10px 16px;
    font-size: 18px;
    line-height: 1.3333333;

    display: block;
    width: 100%;

    background-image: none;
    border: 1px solid #6d0000;

    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;

    font-family: inherit;
    margin: 0;

    :focus {
        border-color: #480000;
        box-shadow: none;
        outline: 0;
    }

    ::placeholder {
        color: #9c2b2b;
    }
`;

export const Button = styled.button`
    color: #ff0d00;
    background: #6d0000;
    border-color: #480000;

    border-radius: 0;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    border-width: 1px;

    border: 1px solid transparent;

    display: block;
    width: 100%;

    margin: 20px 5px;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;

    touch-action: manipulation;
    cursor: pointer;
    background-image: none;

    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;

    user-select: none;

    font-family: inherit;

    :hover, :active {
        background-color: #480000;
    }

    :focus {
        outline: none;
    }
`;