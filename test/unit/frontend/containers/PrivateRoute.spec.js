import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {shallow} from 'enzyme';
import Chance from 'chance';

import {PrivateRoute, mapStateToProps} from '../../../../src/frontend/containers/PrivateRoute';

const chance = new Chance();

describe('<PrivateRoute /> ', () => {
    let auth,
        component,
        randomProp1Value,
        randomProp2Value,
        wrapper;

    const renderComponent = () => {
        wrapper = shallow(
            <PrivateRoute
                auth={auth}
                component={component}
                randomProp1={randomProp1Value}
                randomProp2={randomProp2Value}
            />
        );
    };

    beforeEach(() => {
        auth = {
            idToken: chance.string()
        };
        // eslint-disable-next-line react/display-name
        component = () => <div />;
        randomProp1Value = chance.string();
        randomProp2Value = chance.string();

        renderComponent();
    });

    describe('when mapping state to props', () => {
        let state,
            mappedProps;

        beforeEach(() => {
            state = {
                auth: chance.string()
            };

            mappedProps = mapStateToProps(state);
        });

        test('it should map properly', () => {
            expect(mappedProps).toEqual({
                auth: state.auth
            });
        });
    });

    describe('when the component renders', () => {
        test('it should render a Route as the root element', () => {
            expect(wrapper.type()).toEqual(Route);
            expect(wrapper.props().randomProp1).toEqual(randomProp1Value);
            expect(wrapper.props().randomProp2).toEqual(randomProp2Value);
            expect(typeof wrapper.props().render).toEqual('function');
        });

        describe('when idToken is present', () => {
            let props,
                render;

            beforeEach(() => {
                props = {
                    [chance.string]: chance.string()
                };

                render = wrapper.props().render(props);
            });

            test('it should render the private route', () => {
                expect(render.type()).toEqual(<div />);
                expect(render.props).toEqual(props);
            });
        });

        describe('when idToken is not present', () => {
            let props,
                render;

            beforeEach(() => {
                auth = {};
                props = {
                    [chance.string]: chance.string()
                };

                renderComponent();

                render = wrapper.props().render(props);
            });

            test('it should redirect', () => {
                expect(render.type).toEqual(Redirect);
                expect(render.props.to).toEqual('/authenticate');
            });
        });
    });
});
