// ⠏ | ⠹ | ⠞ | ⠳ | ⠛ | ⡇ | ⠺

const pieces_old = [
    [
        1, 1,
        1, 0,
        1, 0,
        0, 0
    ],
    [
        1, 1,
        0, 1,
        0, 1,
        0, 0,
    ],
    [
        0, 1,
        1, 1,
        1, 0,
        0, 0
    ],
    [
        1, 0,
        1, 1,
        0, 1,
        0, 0
    ],
    [
        1, 1,
        1, 1,
        0, 0,
        0, 0
    ],
    [
        1, 0,
        1, 0,
        1, 0,
        1, 0
    ],
    [
        0, 1,
        1, 1,
        0, 1,
        0, 0
    ]
]

const pieces = {
    i   : { blocks: [0x0F00, 0x2222, 0x00F0, 0x4444], color: 'cyan'   },
    j   : { blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20], color: 'blue'   },
    l   : { blocks: [0x4460, 0x0E80, 0xC440, 0x2E00], color: 'orange' },
    o   : { blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], color: 'yellow' },
    s   : { blocks: [0x06C0, 0x8C40, 0x6C00, 0x4620], color: 'green'  },
    t   : { blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640], color: 'purple' },
    z   : { blocks: [0x0C60, 0x4C80, 0xC600, 0x2640], color: 'red'    },
};

export default pieces;