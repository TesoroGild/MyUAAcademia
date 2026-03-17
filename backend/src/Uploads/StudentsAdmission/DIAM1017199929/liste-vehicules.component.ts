import { MailService } from '../../services/mail/mail.service';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import {
  faFilter,
  faCopy,
  faBackward,
  faCheck,
  faSort,
  faMailBulk,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { VehicleCandidatesService } from '../../services/vehicle-candidates/vehicle-candidates';
import { VehicleResult } from 'src/app/interfaces/vehicleResult';
import { SessionService } from 'src/app/services/session/session.service';
import { Subscription, Observable } from 'rxjs';
import { VehicleCandidate } from 'src/app/interfaces/vehicleCandidate';

const SORT_KEY = 'sort-key';
@Component({
  selector: 'app-liste-vehicules',
  templateUrl: './liste-vehicules.component.html',
  styleUrls: ['./liste-vehicules.component.css'],
})
export class ListeVehiculesComponent implements OnInit, OnDestroy {
  private vehicleItinerarySubscription: Subscription = new Subscription();
  faSort = faSort;
  faCopy = faCopy;
  faBackward = faBackward;
  faCheck = faCheck;
  faFilter = faFilter;
  faMailBulk = faMailBulk;
  faSearch = faSearch;

  loading: boolean = false;
  endOfList: boolean = false;
  menuShow: boolean = false;
  simulated: boolean = false;

  vehicleResult: VehicleResult[] = [];
  vehiclesToDisplay: VehicleResult[] = [];
  vehicleSort: VehicleResult[] = [];

  vehicleIsSimulatedMap: Map<number, boolean> = new Map();

  nbVehicles: number = 0;
  pageSize: number = 4;
  startIndex: number = 0;
  j: number = 0;

  idSession: string | null = '';
  filterSelect: string;
  inputMail: string = '';
  mailSent: string = '';
  inputSessionId: string = '';

  longPollCount: number = 0;
  longPollingObservable: Observable<VehicleResult[]> = new Observable();

  constructor(
    private router: Router,
    private vcs: VehicleCandidatesService,
    private sanitizer: DomSanitizer,
    private ms: MailService,
    private sessn: SessionService
  ) {
    this.filterSelect = this.loadFilterSelection();
  }

  ngOnInit() {
    this.inputSessionId = this.vcs.inputSessionId;
    this.VCSFill();
    this.vcs.vehiclesResult = this.vehicleResult;
    this.vcs.refreshExpectedUserItineraryCount();
    this.longPollingObservable = this.vcs.LongPollingService(
      this.vehicleResult
    );

    this.longPollingObservable.subscribe((results) => {
      this.updateSimulatedVehicles(results);
    });
    this.idSession = localStorage.getItem('sessionId');
  }

  VCSFill() {
    this.vcs.getVehicleCandidates().subscribe((data) => {
      data.data.forEach((value: VehicleResult) => {
        value.candidacy.overAll = this.calculateOverallScore(value.candidacy);
        this.vehicleResult.push(value);
      });
      this.nbVehicles = this.vehicleResult.length;
      this.vcs.nbVehicle = this.nbVehicles;
      this.filter();
      this.setupVehicleIsSimulated();
    });
    return this.vehicleResult;
  }

  calculateOverallScore(candidacy: VehicleCandidate): number {
    return Math.floor((candidacy.autonomyRank + candidacy.priceRank) / 2);
  }

  setupVehicleIsSimulated() {
    this.vehicleResult.forEach((v) => {
      this.vehicleIsSimulatedMap.set(v.vehicle.vehicleId, false);
    });
  }

  updateSimulatedVehicles(newVehicleResults: VehicleResult[]) {
    this.vcs.vehicleSimulated.forEach((v) => {
      if (
        v.ItineraryList[0].userItineraries.length >=
        this.vcs.expectedUserItineraryCount
      )
        this.vehicleIsSimulatedMap.set(v.vehicle.vehicleId, true);
    });

    this.vehicleResult = newVehicleResults;

    this.vehiclesToDisplay.forEach((vehicleDisplay, index) => {
      let vResult = this.vehicleResult.find(
        (v) => vehicleDisplay.vehicle.vehicleId === v.vehicle.vehicleId
      );

      if (vResult != undefined) {
        vResult.candidacy.overAll = this.calculateOverallScore(
          vResult.candidacy
        );
        this.vehiclesToDisplay[index] = vResult;
      }
    });
  }

  isSimulated(id: number) {
    this.j = this.vcs.vehicleSimulated.findIndex(
      (vehicle) => vehicle.vehicle.vehicleId === id
    );
    if (this.j != -1) return true;
    return false;
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  eltByElt(vehicleList: VehicleResult[]) {
    const endIndex = this.startIndex + this.pageSize;
    const newItems: VehicleResult[] = [];
    vehicleList.forEach((item, index) => {
      const itemInformation: VehicleResult = {
        vehicle: item.vehicle,
        candidacy: item.candidacy,
        ItineraryList: item.ItineraryList,
      };
      if (index >= this.startIndex && index < endIndex) {
        newItems.push(itemInformation);
      }
    });
    this.vehiclesToDisplay = [...this.vehiclesToDisplay, ...newItems];
    this.startIndex += this.pageSize;
    return newItems;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll($event: any) {
    const scrollPosition = window.scrollY;
    const pageHeight = document.body.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollEnd = pageHeight - windowHeight - 1;
    if (scrollPosition >= scrollEnd) {
      this.eltByElt(this.vehicleSort);
    }
  }

  vehicleDetails(id: Number) {
    this.vcs.idCurrentVehicle = id;
    return this.router.navigate(['/details']);
  }

  /*
  Dans le futur, nous pourrions développer un filtre basé sur les "overalls"
  et donc remplacer le filtre par défault par celui là 
  (TODO pour la prochaine session?)
  */
  filter() {
    this.vehiclesToDisplay = [];
    this.vehicleSort = [];
    switch (this.filterSelect) {
      case 'default':
        this.vehicleSort = this.vehicleResult;
        break;

      case 'sortByPriceAsc':
        this.vehicleSort = this.vehicleResult.sort(
          (a, b) => a.vehicle.price - b.vehicle.price
        );
        break;

      case 'sortByPriceDesc':
        this.vehicleSort = this.vehicleResult.sort(
          (a, b) => b.vehicle.price - a.vehicle.price
        );
        break;

      case 'sortByAutonomyAsc':
        this.vehicleSort = this.vehicleResult.sort(
          (a, b) => a.vehicle.autonomy - b.vehicle.autonomy
        );
        break;

      case 'sortByAutonomyDesc':
        this.vehicleSort = this.vehicleResult.sort(
          (a, b) => b.vehicle.autonomy - a.vehicle.autonomy
        );
        break;

      default:
        this.vehicleSort = this.vehicleResult;
        break;
    }
    this.saveFilterSelection();
    this.startIndex = 0;
    this.eltByElt(this.vehicleSort);
  }

  donutRank(rank: number): number {
    if (this.nbVehicles > 0) {
      return Math.ceil(((this.nbVehicles - rank + 1) / this.nbVehicles) * 100);
    } else {
      return 0;
    }
  }

  saveFilterSelection() {
    localStorage.setItem(SORT_KEY, this.filterSelect);
  }

  loadFilterSelection(): string {
    if (localStorage.getItem(SORT_KEY) == null) {
      return 'sortByPriceAsc';
    } else {
      return String(localStorage.getItem(SORT_KEY));
    }
  }

  copyLink() {}

  toggleNavbar() {
    this.menuShow = !this.menuShow;
  }

  copySessionId() {
    const textArea = document.createElement('textarea');
    textArea.value = String(this.idSession);
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }

  showResultFromAnotherSessionId() {
    this.vcs.inputSessionId = this.inputSessionId;
    this.sessn.getSession(this.inputSessionId).subscribe((data) => {
      if (data.data != null) {
        const url = ['/sessionResult'];
        const queryParams = { sessionId: this.inputSessionId };
        const navigationExtras: NavigationExtras = { queryParams };
        const fullUrl = this.router
          .createUrlTree(url, navigationExtras)
          .toString();
        return window.open(fullUrl, '_blank');
      } else {
        console.log('ICI');
        this.showPopup();
        return 0;
      }
    });
  }

  showPopup() {
    const popupElement = document.getElementById('popupHide');
    if (popupElement) {
      popupElement.style.display = 'block';
    }
  }

  hidePopup() {
    const popupElement = document.getElementById('popupHide');
    if (popupElement) {
      popupElement.style.display = 'none';
    }
  }

  returnToSimulation() {
    return this.router.navigate(['/besoins']);
  }

  mailTo() {
    if (this.inputMail.trim() !== '') this.ms.sendMail(this.inputMail.trim());
  }
  ngOnDestroy() {
    this.vehicleItinerarySubscription.unsubscribe();
  }

  getColorForRank(rank: number): string {
    if (
      (rank / this.nbVehicles) * 100 > 0 &&
      (rank / this.nbVehicles) * 100 < 33
    ) {
      return 'lightgreen';
    } else if (
      (rank / this.nbVehicles) * 100 > 33.1 &&
      (rank / this.nbVehicles) * 100 < 66
    ) {
      return 'orange';
    } else if (
      (rank / this.nbVehicles) * 100 > 66.1 &&
      (rank / this.nbVehicles) * 100 < 101
    ) {
      return 'red';
    } else {
      return '';
    }
  }

  getColorForPriceRank(priceRank: number): string {
    return this.getColorForRank(priceRank);
  }

  getColorForAutonomyRank(autonomyRank: number): string {
    return this.getColorForRank(autonomyRank);
  }

  getColorForOverallRank(overAllRank: number): string {
    return this.getColorForRank(overAllRank);
  }
}
