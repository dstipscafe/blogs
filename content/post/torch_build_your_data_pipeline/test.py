class Demo:
    def __init__(self):
        self.a = 'string_a'
        self.b = 'string_b'
        self.c = 'string_c'
    
    def __getitem__(self, index):
        match index:
            case 1:
                return self.a
            case 2:
                return self.b
            case 3:
                return self.c
            case _:
                raise IndexError(f'Given index: {index} out of range.')
            
demo = Demo()
print(demo[4])