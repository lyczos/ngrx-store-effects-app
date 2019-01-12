import { Injectable } from '@angular/core';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Effect, Actions } from '@ngrx/effects';

import * as pizzaActions from '../actions/pizzas.action';
import * as fromServices from '../../services';
import { of } from 'rxjs/observable/of';

@Injectable()
export class PizzasEffects {
  constructor(
    private actions$: Actions,
    private pizzaService: fromServices.PizzasService
  ) {}

  @Effect()
  loadPizzas$ = this.actions$.ofType(pizzaActions.LOAD_PIZZAS).pipe(
    switchMap(() => {
      return this.pizzaService.getPizzas().pipe(
        map(pizzas => new pizzaActions.LoadPizzasSuccess(pizzas)),
        catchError(err => of(new pizzaActions.LoadPizzasFail(err)))
      );
    })
  );

  @Effect()
  createPizza$ = this.actions$.ofType(pizzaActions.CREATE_PIZZA).pipe(
    map((action: pizzaActions.CreatePizza) => action.payload),
    switchMap(pizza => {
      return this.pizzaService.createPizza(pizza).pipe(
        map(pizza => new pizzaActions.CreatePizzaSuccess(pizza)),
        catchError(err => of(new pizzaActions.CreatePizzaFail(err)))
      );
    })
  );
}
