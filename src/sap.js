/* chargement des diférentes librairies */
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
/* mise en place du style css */
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 350
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));
/* définition des valeurs */
const VALIDATION_NATURE_ERP = 2;
const VALIDATION_NATURE_CDT = 1;
const VALIDATION_ACTIVITE_JU = 5;
const VALIDATION_ACTIVITE_OR = 3;
const VALIDATION_ACTIVITE_AUTRE = 1;
/* définition des seuil d'effectif */
const FIRST_THRESHOLD_EFFECTIF = 100;
const SECOND_THRESHOLD_EFFECTIF = 200;
const THRID_THRESHOLD_EFFECTIF = 300;
const FOUR_THRESHOLD_EFFECTIF = 500;
const FIVE_THRESHOLD_EFFECTIF = 1000;
const SIXE_THRESHOLD_EFFECTIF = 5000;
/* calcul du total sap max et de la pondération de l'activité secondaire */
const MAX_SAP_RELATIF = 4.5;
const PONDERATION_ACTIVITE_SEC = 0.25;
const TOTAL_MAX_SITUATION_DEFAVORABLE = 30;

/*fonction principale */
export default function SimpleSelect() {
  /* définition de mes valeurs a vérifier */
  const classes = useStyles();
  const [destinationBatiment, setDestinationBatiment] = useState(0);
  const [activitePrincipale, setActivitePrincipale] = useState(0);
  const [activiteSecondaire, setActiviteSecondaire] = useState(0);
  const [effectif, setEffectif] = useState(0);
  const [logement, setLogement] = useState(false);
  /* fonctionnaliter de notation */
  /*calcule du coefficient de l'effectif */
  const calculCoeffEffectif = () => {
    let coef = 0;
    if (effectif <= FIRST_THRESHOLD_EFFECTIF) {
      coef = 1;
    } else if (effectif <= SECOND_THRESHOLD_EFFECTIF) {
      coef = 2;
    } else if (effectif <= THRID_THRESHOLD_EFFECTIF) {
      coef = 2.5;
    } else if (effectif <= FOUR_THRESHOLD_EFFECTIF) {
      coef = 3;
    } else if (effectif <= FIVE_THRESHOLD_EFFECTIF) {
      coef = 4;
    } else if (effectif <= SIXE_THRESHOLD_EFFECTIF) {
      coef = 10;
    } else {
      coef = 20;
    }
    return coef;
  };
  /*calcule du coefficient du logement */
  const coeffLogement = () => {
    let coefficient = 0;
    if (logement) {
      coefficient = 0.5;
    }
    return coefficient;
  };
  /* variable de debug*/
  const pondActiviteSec = activiteSecondaire * PONDERATION_ACTIVITE_SEC;
  /* mise en application de la formule de notation */
  const situationSapBatiment =
    destinationBatiment *
    (activitePrincipale + activiteSecondaire * PONDERATION_ACTIVITE_SEC) *
    calculCoeffEffectif();
  const indiceSap =
    (situationSapBatiment / TOTAL_MAX_SITUATION_DEFAVORABLE) * MAX_SAP_RELATIF;
  const maxRelatif = () => {
    let value = 0;
    if (situationSapBatiment > TOTAL_MAX_SITUATION_DEFAVORABLE) {
      value = 5;
      console.log(value);
    } else {
      value = indiceSap;
    }
    return value;
  };
  const indiceAvecLogement = maxRelatif() + coeffLogement();
  const indiceSapFinal = Math.round(indiceAvecLogement);

  /*gestion du workflow */

  return (
    <React.Fragment>
      <h2>Indice Secours à Personnes : </h2> {indiceSapFinal}
      <br />
      <br />
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="destinationBatiment">
            Destination du bâtiment
          </InputLabel>
          <Select
            labelId="destinationBatiment"
            value={destinationBatiment}
            onChange={(event) => setDestinationBatiment(event.target.value)}
            inputProps={{
              id: "destinationBatiment",
              name: "destinationBatiment"
            }}
            variant="outlined"
          >
            <MenuItem value={0}>
              <em></em>
            </MenuItem>
            <MenuItem value={VALIDATION_NATURE_ERP}>ERP</MenuItem>
            <MenuItem value={VALIDATION_NATURE_CDT}>CDT</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="activitePrincipaleBatiment">
            Activité principale du bâtiment
          </InputLabel>
          <Select
            labelId="activitePrincipaleBatiment"
            id="activitePrincipaleBatiment"
            name="activitePrincipale"
            value={activitePrincipale}
            onChange={(event) => setActivitePrincipale(event.target.value)}
            variant="outlined"
          >
            <MenuItem value={0}>
              <em></em>
            </MenuItem>
            <MenuItem value={VALIDATION_ACTIVITE_JU}>JU</MenuItem>
            <MenuItem value={VALIDATION_ACTIVITE_OR}>OR</MenuItem>
            <MenuItem value={VALIDATION_ACTIVITE_AUTRE}>Autre</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="activiteSecondaireBatiment">
            Activité secondaire du bâtiment
          </InputLabel>
          <Select
            labelId="activiteSecondaireBatiment"
            id="activiteSecondaireBatiment"
            name="activiteSecondaire"
            value={activiteSecondaire}
            onChange={(event) => setActiviteSecondaire(event.target.value)}
            variant="outlined"
          >
            <MenuItem value={0}>
              <em></em>
            </MenuItem>
            <MenuItem value={VALIDATION_ACTIVITE_JU}>JU</MenuItem>
            <MenuItem value={VALIDATION_ACTIVITE_OR}>OR</MenuItem>
            <MenuItem value={VALIDATION_ACTIVITE_AUTRE}>Autre</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            id="effectif"
            name="effectif"
            label="Effectif"
            type="number"
            variant="outlined"
            value={effectif}
            onChange={(event) => setEffectif(event.target.value)}
          />
        </FormControl>

        <FormControl className={classes.formControl}>
          <FormControlLabel
            value={logement}
            control={
              <Checkbox
                color="primary"
                name="logement"
                checked={logement}
                onChange={(event) => setLogement(event.target.checked)}
              />
            }
            label="picto logement"
            labelPlacement="start"
          />
        </FormControl>
      </div>
      <div>
        <h4> Résultat formulaire débug</h4>
        <p>Destination du Bâtiment :</p> {destinationBatiment}
        <p>Activité principale :</p> {activitePrincipale}
        <p>Activité secondaire :</p> {pondActiviteSec}
        <p> Effectif du bâtiment :</p> {effectif}
        <p> Coefficient de l'effectif : </p> {calculCoeffEffectif()}
        <p> Total avant indice :</p> {situationSapBatiment}
        <p>Indice SAP sans logement :</p> {indiceSap}
        <p>Indice SAP avec logement : </p> {indiceAvecLogement}
      </div>
    </React.Fragment>
  );
}
