import { ComponentType } from 'react';
import {
  useParams,
  useSearchParams,
  URLSearchParamsInit,
  NavigateOptions,
  useNavigate,
  NavigateFunction,
} from 'react-router-dom';

type SetURLSearchParams = (
  nextInit?:
    | URLSearchParamsInit
    | ((prev: URLSearchParams) => URLSearchParamsInit),
  navigateOpts?: NavigateOptions
) => void;

export interface INavigationData {
  params: ReturnType<typeof useParams>;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  navigate: NavigateFunction;
}

export const withNavigation = <C,>(
  Component: ComponentType<C & INavigationData>
) => {
  return (props: C ) => {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    return (
      <Component
        {...props}
        {...{ params, searchParams, setSearchParams, navigate }}
      />
    );
  };
};
