import {Router, ActivatedRoute, Params} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {RaceItemService} from "./race-item.service";
import {environment} from "../../environments/environment";
import {PanierService} from "../panier/panier.service";
import { NotifierService } from "angular-notifier";
import {ReversePipe} from 'ngx-pipes';
import {FooterService} from "../footer/footer.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-race-item',
  templateUrl: './race-item.component.html',
  styleUrls: ['./race-item.component.css'],
  providers: [ReversePipe, FooterService]
})
export class RaceItemComponent implements OnInit {
  private readonly notifier: NotifierService;
  id:string;
  race;
  apiUrl;
  offers;
  offersNumberChoice = {};
  isSend = false;

  constructor(
    private route: ActivatedRoute,
    private raceItemService: RaceItemService,
    private panierService : PanierService,
    notifierService: NotifierService,
    private footerService : FooterService,
  ) {
    this.notifier = notifierService;
    this.fetchRace(this.route.snapshot.paramMap.get('id'));
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  fetchRace(id) : void {
    this.raceItemService.fetchRace(id).subscribe(
      data => {
        this.race = data['data'].race;
        this.offers = this.groupBy(data['data'].race.Offers, 'category');
        data['data'].race.Offers.forEach(value => {
          this.offersNumberChoice[value.id] = 1;
        })
      },
      error => console.error('Erreur :', error)
    );
  }

  groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  keys(object) {
    return Object.keys(object)
  }

  addInCart(offer) {
    this.panierService.addToCart(offer, this.offersNumberChoice[offer.id], this.race);
    this.notifier.notify("success", "Vous avez ajouté " + this.offersNumberChoice[offer.id] + " place(s) dans votre panier !");
  }

  selectChangeHandler (event: any, id) {
    this.offersNumberChoice[id] = parseInt(event.target.value);
  }

  onSubmit(form: NgForm) {
    this.footerService.storeNotification(form.value).subscribe(
      data => {
        // notification visuelle
        this.notifier.notify("success", "Vous avez été ajouté dans la base de données des emails");
        form.resetForm();
      },
      error => {
        this.notifier.notify("error", "Erreur dans l'ajout. Essayez à nouveau plus tard.");
      }
    );
    this.isSend = true;
  }
}
