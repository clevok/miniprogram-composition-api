import { ISetup } from './shared';
export declare function defineComponent<P extends {
    [key: string]: any;
}>(componentOptions: {
    props: P;
    setup?: ISetup<P>;
    [key: string]: any;
} | ISetup<P>): any;
