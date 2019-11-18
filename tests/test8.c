int pow(int x, int factor) {
    if (factor == 1) {
        return(x);
    } else {
        return(x * pow(x, factor - 1));
    }
}

int main() {
    int b;
    b = pow(2, 4);
    print(b);
}
